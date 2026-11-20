/** Storage wrappers. Depend only on the narrow shape below so tests can use a fake. */

import type { GatherLink, GatherSighting, GatherSource, VerificationState } from "./types.ts";
import { isVerificationState } from "./types.ts";
import { linkId } from "./sync.ts";

export interface QueryResult<T> {
	items: Array<{ id: string; data: T }>;
	cursor?: string;
	hasMore?: boolean;
}

export interface StoreCollection<T> {
	get(id: string): Promise<T | null>;
	put(id: string, data: T): Promise<void>;
	delete(id: string): Promise<boolean>;
	compareAndSet(
		id: string,
		expectedRevision: string | null,
		data: T,
	): Promise<{ applied: boolean }>;
	query(options?: {
		where?: Record<string, unknown>;
		orderBy?: Record<string, "asc" | "desc">;
		limit?: number;
		cursor?: string;
	}): Promise<QueryResult<T>>;
	count(where?: Record<string, unknown>): Promise<number>;
}

export interface GatherStores {
	sources: StoreCollection<GatherSource>;
	sightings: StoreCollection<GatherSighting>;
	links: StoreCollection<GatherLink>;
}

/** Idempotent source upsert. Returns true when the record changed. */
export async function putSource(
	stores: GatherStores,
	source: GatherSource,
): Promise<boolean> {
	const existing = await stores.sources.get(source.domain);
	if (
		existing &&
		existing.feedUrl === source.feedUrl &&
		existing.name === source.name &&
		existing.homepage === source.homepage &&
		existing.collection === source.collection &&
		existing.country === source.country
	) {
		return false;
	}
	await stores.sources.put(source.domain, {
		...source,
		lastPolledAt: existing?.lastPolledAt ?? null,
		lastError: existing?.lastError ?? null,
	});
	return true;
}

/** Record a sighting, preserving the earliest firstSeenAt. Returns true when new. */
export async function recordSighting(
	stores: GatherStores,
	sighting: GatherSighting,
): Promise<boolean> {
	const result = await stores.sightings.compareAndSet(
		sighting.canonicalUrl,
		null,
		sighting,
	);
	return result.applied;
}

/** Link a sighting to an article. Idempotent. */
export async function linkSighting(
	stores: GatherStores,
	articleId: string,
	sightingId: string,
	firstSeenAt: string,
	now = new Date().toISOString(),
): Promise<boolean> {
	const id = linkId(articleId, sightingId);
	const existing = await stores.links.get(id);
	if (existing) return false;
	await stores.links.put(id, {
		articleId,
		sightingId,
		verification: "unverified",
		firstSeenAt,
		updatedAt: now,
	});
	return true;
}

/** Set a link's verification state. Throws on unknown states. */
export async function setVerification(
	stores: GatherStores,
	articleId: string,
	sightingId: string,
	verification: VerificationState,
	now = new Date().toISOString(),
): Promise<void> {
	if (!isVerificationState(verification)) {
		throw new Error(`Unknown verification state: ${String(verification)}`);
	}
	const id = linkId(articleId, sightingId);
	const existing = await stores.links.get(id);
	if (!existing) throw new Error(`No link for ${id}`);
	await stores.links.put(id, { ...existing, verification, updatedAt: now });
}

/** Per-article feed, oldest first. Joins links to their sightings. */
export async function getArticleFeed(
	stores: GatherStores,
	articleId: string,
): Promise<Array<{ link: GatherLink; sighting: GatherSighting | null }>> {
	const { items } = await stores.links.query({
		where: { articleId },
		orderBy: { firstSeenAt: "asc" },
		limit: 100,
	});
	const out: Array<{ link: GatherLink; sighting: GatherSighting | null }> = [];
	for (const { data: link } of items) {
		out.push({
			link,
			sighting: await stores.sightings.get(link.sightingId),
		});
	}
	return out;
}
