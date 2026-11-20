/** Runtime wiring: descriptor factory + definePlugin with storage, cron, and hooks. */

import { definePlugin } from "emdash";
import type { PluginContext, PluginDescriptor } from "emdash";
import type { GatherSighting, GatherSource } from "./types.ts";
import { isVerificationState } from "./types.ts";
import { canonicalStoryUrl } from "./urls.ts";
import { parseFeedItems } from "./rss.ts";
import { mapDirectorySource, pickFeedUrl } from "./sync.ts";
import { getArticleFeed, putSource, recordSighting, setVerification } from "./store.ts";
import type { GatherStores } from "./store.ts";

export const PLUGIN_ID = "gather";
export const PLUGIN_VERSION = "0.2.0";

export interface GatherPluginOptions {
	/** MediaCloud API key. Defaults to process.env.MEDIACLOUD_API_KEY. */
	mediaCloudApiKey?: string;
	/** Collection names to sync, e.g. ["United States - National"]. */
	collections?: string[];
}

export function gatherPlugin(
	options: GatherPluginOptions = {},
): PluginDescriptor<GatherPluginOptions> {
	return {
		id: PLUGIN_ID,
		version: PLUGIN_VERSION,
		format: "native",
		entrypoint: "@thatsthe-news/plugin-gather",
		adminEntry: "@thatsthe-news/plugin-gather/admin",
		options,
	};
}

type Ctx = PluginContext;

interface GatherConfig {
	apiKey: string | null;
	collections: string[];
	pollLimit: number;
}

/** Descriptor options win, then stored settings, then environment. */
async function resolveConfig(ctx: Ctx, options: GatherPluginOptions): Promise<GatherConfig> {
	const settingsKey = await ctx.settings.get<string>("apiKey");
	const settingsCollections = await ctx.settings.get<string>("collections");
	const settingsLimit = await ctx.settings.get<number>("pollLimit");
	return {
		apiKey:
			options.mediaCloudApiKey ??
			settingsKey ??
			process.env.MEDIACLOUD_API_KEY ??
			null,
		collections:
			options.collections ??
			settingsCollections
				?.split(",")
				.map((name) => name.trim())
				.filter(Boolean) ??
			[],
		pollLimit: settingsLimit ?? 50,
	};
}

function storesFrom(ctx: Ctx): GatherStores {
	const storage = ctx.storage as unknown as GatherStores;
	return {
		sources: storage.sources,
		sightings: storage.sightings,
		links: storage.links,
	};
}

function fetchFn(ctx: Ctx): typeof fetch {
	const http = (ctx as { http?: { fetch: typeof fetch } }).http;
	return http ? http.fetch.bind(http) : fetch;
}

async function syncDirectory(
	ctx: Ctx,
	options: GatherPluginOptions,
): Promise<{ sources: number; unchanged: number }> {
	const config = await resolveConfig(ctx, options);
	const apiKey = config.apiKey;
	const stores = storesFrom(ctx);
	if (!apiKey) {
		ctx.log.info("Gather: MEDIACLOUD_API_KEY not set, skipping directory sync");
		return { sources: 0, unchanged: 0 };
	}
	const doFetch = fetchFn(ctx);
	let created = 0;
	let unchanged = 0;
	for (const collectionName of config.collections) {
		const params = new URLSearchParams({
			name: collectionName,
			limit: "20",
		});
		const res = await doFetch(
			`https://search.mediacloud.org/api/sources/collections/?${params}`,
			{ headers: { Authorization: `Token ${apiKey}` } },
		);
		if (!res.ok) {
			ctx.log.error("Gather: collection lookup failed", {
				collectionName,
				status: res.status,
			});
			continue;
		}
		const payload = (await res.json()) as {
			results?: Array<{ id: number; name: string }>;
		};
		for (const collection of payload.results ?? []) {
			let offset = 0;
			for (;;) {
				const pageParams = new URLSearchParams({
					collection_id: String(collection.id),
					limit: "100",
					offset: String(offset),
				});
				const pageRes = await doFetch(
					`https://search.mediacloud.org/api/sources/sources/?${pageParams}`,
					{ headers: { Authorization: `Token ${apiKey}` } },
				);
				if (!pageRes.ok) {
					ctx.log.error("Gather: source page failed", {
						collectionId: collection.id,
						status: pageRes.status,
					});
					break;
				}
				const page = (await pageRes.json()) as {
					results?: Array<{
						name?: string;
						label?: string;
						homepage?: string;
						pub_country?: string | null;
					}>;
					next?: string | null;
				};
				for (const row of page.results ?? []) {
					// Feed URL resolution is best-effort here; the poller also
					// discovers /rss.xml and /feed.xml conventions per source.
					const source = mapDirectorySource(row, collection.name, null);
					if (!source) continue;
					const changed = await putSource(stores, source);
					if (changed) created++;
					else unchanged++;
				}
				if (!page.next) break;
				offset += page.results?.length ?? 0;
			}
		}
	}
	ctx.log.info("Gather: directory sync complete", { created, unchanged });
	return { sources: created, unchanged };
}

async function pollFeeds(ctx: Ctx, options: GatherPluginOptions): Promise<number> {
	const config = await resolveConfig(ctx, options);
	const stores = storesFrom(ctx);
	const doFetch = fetchFn(ctx);
	const { items } = await stores.sources.query({
		orderBy: { domain: "asc" },
		limit: config.pollLimit,
	});
	let sightings = 0;
	for (const { data: source } of items) {
		const candidates = [
			source.feedUrl,
			`${source.homepage.replace(/\/$/, "")}/rss.xml`,
			`${source.homepage.replace(/\/$/, "")}/feed.xml`,
		].filter((u): u is string => !!u);
		let polled = false;
		for (const feedUrl of candidates) {
			let res: Response;
			try {
				res = await doFetch(feedUrl, {
					headers: { "User-Agent": "thatsthe.news gather/0.1" },
				});
			} catch (error) {
				ctx.log.error("Gather: feed fetch failed", {
					domain: source.domain,
					error: String(error),
				});
				continue;
			}
			if (!res.ok) continue;
			const xml = await res.text();
			const now = new Date().toISOString();
			for (const item of parseFeedItems(xml)) {
				const canonical = canonicalStoryUrl(item.url);
				if (!canonical) continue;
				const sighting: GatherSighting = {
					canonicalUrl: canonical,
					sourceId: source.domain,
					url: item.url,
					title: item.title,
					publishedAt: item.publishedAt,
					firstSeenAt: now,
				};
				if (await recordSighting(stores, sighting)) sightings++;
			}
			polled = true;
			break;
		}
		const record: GatherSource = {
			...source,
			lastPolledAt: new Date().toISOString(),
			lastError: polled ? null : source.lastError,
		};
		await stores.sources.put(source.domain, record);
	}
	ctx.log.info("Gather: feed poll complete", { sightings });
	return sightings;
}

export function createPlugin(options: GatherPluginOptions = {}) {
	return definePlugin({
		id: PLUGIN_ID,
		version: PLUGIN_VERSION,
		displayName: "Gather",
		description:
			"Continuous source monitoring with per-article shared source feeds.",
		capabilities: ["content:read", "network:request"],
		// No allowedHosts: the poller fetches arbitrary registered feed hosts,
		// and absent allowedHosts means unrestricted network by contract.
		storage: {
			sources: {
				indexes: ["collection", "country"],
				uniqueIndexes: ["domain"],
			},
			sightings: {
				indexes: ["sourceId", "firstSeenAt", ["sourceId", "firstSeenAt"]],
				uniqueIndexes: ["canonicalUrl"],
			},
			links: {
				indexes: [
					"articleId",
					"sightingId",
					"verification",
					["articleId", "firstSeenAt"],
					["verification", "firstSeenAt"],
				],
				uniqueIndexes: [["articleId", "sightingId"]],
			},
		},
		admin: {
			entry: "@thatsthe-news/plugin-gather/admin",
			pages: [{ path: "/gather", label: "Gather", icon: "rss" }],
			widgets: [{ id: "gather-status", title: "Gather status" }],
			settingsSchema: {
				apiKey: {
					type: "secret",
					label: "MediaCloud API key",
					description: "Used for directory sync. Falls back to MEDIACLOUD_API_KEY.",
				},
				collections: {
					type: "string",
					label: "Collections",
					description: "Comma-separated MediaCloud collection names to sync.",
					default: "United States - National",
				},
				pollLimit: {
					type: "number",
					label: "Poll limit",
					description: "Max sources polled per cycle.",
					min: 1,
					max: 200,
					default: 50,
				},
			},
		},
		hooks: {
			"plugin:install": async (_event, ctx) => {
				if (!ctx.cron) throw new Error("Cron access unavailable");
				try {
					await ctx.cron.schedule("gather-sync", {
						schedule: "5 */6 * * *",
					});
				} catch (error) {
					ctx.log.info("Gather: sync schedule already exists", {
						error: String(error),
					});
				}
				try {
					await ctx.cron.schedule("gather-poll", {
						schedule: "15 * * * *",
					});
				} catch (error) {
					ctx.log.info("Gather: poll schedule already exists", {
						error: String(error),
					});
				}
			},
			cron: async (event, ctx) => {
				if (event.name === "gather-sync") {
					await syncDirectory(ctx, options);
				} else if (event.name === "gather-poll") {
					await pollFeeds(ctx, options);
				}
			},
		},
		routes: {
			feed: {
				public: true,
				handler: async (ctx) => {
					const input = ctx.input as { articleId?: unknown };
					if (typeof input?.articleId !== "string" || !input.articleId) {
						return { ok: false as const, error: "INVALID_ARTICLE_ID" };
					}
					const feed = await getArticleFeed(storesFrom(ctx), input.articleId);
					const entries = feed.map(({ link, sighting }) => ({
						...link,
						title: sighting?.title ?? link.sightingId,
						url: sighting?.url ?? null,
						sourceId: sighting?.sourceId ?? null,
						first: false,
					}));
					if (entries.length > 0) entries[0].first = true;
					return { ok: true as const, entries };
				},
			},
			status: {
				handler: async (ctx) => {
					const stores = storesFrom(ctx);
					const [sources, sightings, pending] = await Promise.all([
						stores.sources.count(),
						stores.sightings.count(),
						stores.links.count({ verification: "unverified" }),
					]);
					return { sources, sightings, pending };
				},
			},
			sources: {
				handler: async (ctx) => {
					const input = ctx.input as { limit?: unknown; cursor?: unknown };
					const limit =
						typeof input?.limit === "number"
							? Math.min(Math.max(input.limit, 1), 100)
							: 50;
					const cursor =
						typeof input?.cursor === "string" ? input.cursor : undefined;
					const result = await storesFrom(ctx).sources.query({
						orderBy: { domain: "asc" },
						limit,
						cursor,
					});
					return {
						items: result.items.map(({ data }) => data),
						cursor: result.cursor ?? null,
						hasMore: result.hasMore ?? false,
					};
				},
			},
			queue: {
				handler: async (ctx) => {
					const stores = storesFrom(ctx);
					const { items } = await stores.links.query({
						where: { verification: "unverified" },
						orderBy: { firstSeenAt: "asc" },
						limit: 50,
					});
					const entries = [];
					for (const { data: link } of items) {
						const sighting = await stores.sightings.get(link.sightingId);
						entries.push({
							...link,
							title: sighting?.title ?? link.sightingId,
							url: sighting?.url ?? null,
							sourceId: sighting?.sourceId ?? null,
						});
					}
					return { entries };
				},
			},
			verify: {
				methods: ["POST"],
				handler: async (ctx) => {
					const input = ctx.input as {
						articleId?: unknown;
						sightingId?: unknown;
						verification?: unknown;
					};
					if (
						typeof input?.articleId !== "string" ||
						typeof input?.sightingId !== "string" ||
						!isVerificationState(input?.verification)
					) {
						return { ok: false as const, error: "INVALID_INPUT" };
					}
					try {
						await setVerification(
							storesFrom(ctx),
							input.articleId,
							input.sightingId,
							input.verification,
						);
					} catch {
						return { ok: false as const, error: "NOT_FOUND" };
					}
					return { ok: true as const };
				},
			},
		},
	});
}

export default createPlugin;
export { pickFeedUrl };
