import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
	linkSighting,
	setVerification,
	recordSighting,
	putSource,
	getArticleFeed,
	type StoreCollection,
	type GatherStores,
} from "./store.ts";
import type { GatherLink, GatherSighting, GatherSource } from "./types.ts";
import { mapDirectorySource, pickFeedUrl, linkId } from "./sync.ts";

/** Minimal in-memory StoreCollection for wrapper tests. */
function fake<T>() {
	const rows = new Map<string, { value: T; revision: number }>();
	const collection: StoreCollection<T> = {
		get: async (id) => rows.get(id)?.value ?? null,
		put: async (id, data) => {
			const prev = rows.get(id);
			rows.set(id, { value: data, revision: (prev?.revision ?? 0) + 1 });
		},
		delete: async (id) => rows.delete(id),
		compareAndSet: async (id, expected, data) => {
			const prev = rows.get(id);
			if (expected === null && prev) return { applied: false };
			if (expected !== null && prev?.revision !== Number(expected)) {
				return { applied: false };
			}
			rows.set(id, { value: data, revision: (prev?.revision ?? 0) + 1 });
			return { applied: true };
		},
		query: async (options) => {
			let items = [...rows.entries()].map(([id, { value }]) => ({
				id,
				data: value,
			}));
			const where = options?.where as Record<string, unknown> | undefined;
			if (where) {
				items = items.filter((item) =>
					Object.entries(where).every(
						([k, v]) =>
							(item.data as Record<string, unknown>)[k] === v,
					),
				);
			}
			const orderBy = options?.orderBy;
			if (orderBy) {
				const [[field, dir]] = Object.entries(orderBy);
				items.sort((a, b) => {
					const av = String(
						(a.data as Record<string, unknown>)[field] ?? "",
					);
					const bv = String(
						(b.data as Record<string, unknown>)[field] ?? "",
					);
					return dir === "asc"
						? av.localeCompare(bv)
						: bv.localeCompare(av);
				});
			}
			return { items: items.slice(0, options?.limit ?? 50) };
		},
		count: async () => rows.size,
	};
	return collection;
}

function stores(): GatherStores {
	return {
		sources: fake<GatherSource>(),
		sightings: fake<GatherSighting>(),
		links: fake<GatherLink>(),
	};
}

describe("store wrappers", () => {
	it("putSource is idempotent", async () => {
		const s = stores();
		const source: GatherSource = {
			domain: "example.com",
			name: "Example",
			homepage: "https://example.com/",
			feedUrl: null,
			collection: "Test",
			country: null,
			lastPolledAt: null,
			lastError: null,
		};
		assert.equal(await putSource(s, source), true);
		assert.equal(await putSource(s, source), false);
	});

	it("recordSighting preserves first-seen", async () => {
		const s = stores();
		const first: GatherSighting = {
			canonicalUrl: "example.com/a",
			sourceId: "example.com",
			url: "https://example.com/a",
			title: "A",
			publishedAt: null,
			firstSeenAt: "2026-11-20T10:00:00.000Z",
		};
		assert.equal(await recordSighting(s, first), true);
		assert.equal(
			await recordSighting(s, { ...first, firstSeenAt: "2026-11-21T10:00:00.000Z" }),
			false,
		);
		assert.equal(
			(await s.sightings.get("example.com/a"))?.firstSeenAt,
			"2026-11-20T10:00:00.000Z",
		);
	});

	it("links feed oldest-first and verifies", async () => {
		const s = stores();
		await linkSighting(s, "art-1", "example.com/b", "2026-11-20T11:00:00.000Z");
		await linkSighting(s, "art-1", "example.com/a", "2026-11-20T10:00:00.000Z");
		assert.equal(
			await linkSighting(s, "art-1", "example.com/a", "2026-11-20T10:00:00.000Z"),
			false,
		);
		const feed = await getArticleFeed(s, "art-1");
		assert.equal(feed[0].link.sightingId, "example.com/a");
		await setVerification(s, "art-1", "example.com/a", "verified");
		assert.equal(
			(await s.links.get(linkId("art-1", "example.com/a")))?.verification,
			"verified",
		);
		await assert.rejects(() =>
			setVerification(s, "art-1", "example.com/a", "bogus" as never),
		);
	});
});

describe("directory mapping", () => {
	it("maps rows and picks feed urls", () => {
		const source = mapDirectorySource(
			{ name: "example.com", label: "Example", homepage: "https://example.com" },
			"Test National",
			"https://example.com/rss.xml",
		);
		assert.equal(source?.domain, "example.com");
		assert.equal(pickFeedUrl({ feed_url: "https://example.com/f.xml" }), "https://example.com/f.xml");
		assert.equal(pickFeedUrl({}), null);
		assert.equal(mapDirectorySource({ name: "not a domain!!!" }, null, null), null);
	});
});
