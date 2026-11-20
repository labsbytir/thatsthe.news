/** Pure mapping from MediaCloud v4 directory payloads to registry records. */

import type { GatherSource } from "./types.ts";
import { canonicalDomain } from "./urls.ts";

export interface DirectorySourceRow {
	id?: number;
	name?: string;
	label?: string;
	homepage?: string;
	platform?: string | null;
	pub_country?: string | null;
	primary_language?: string | null;
}

export interface DirectoryFeedRow {
	url?: string;
	feed_url?: string;
	rss_url?: string;
	link?: string;
}

export function pickFeedUrl(feed: DirectoryFeedRow | null | undefined): string | null {
	if (!feed || typeof feed !== "object") return null;
	for (const key of ["url", "feed_url", "rss_url", "link"] as const) {
		const value = feed[key];
		if (typeof value === "string" && value.startsWith("http")) return value;
	}
	return null;
}

export function mapDirectorySource(
	row: DirectorySourceRow,
	collection: string | null,
	feedUrl: string | null,
): GatherSource | null {
	const domain = canonicalDomain(row.name ?? "");
	if (!domain) return null;
	return {
		domain,
		name: row.label || row.name || domain,
		homepage: row.homepage || `https://${domain}/`,
		feedUrl,
		collection,
		country: row.pub_country ?? null,
		lastPolledAt: null,
		lastError: null,
	};
}

/** Stable registry ID for an article link row. */
export function linkId(articleId: string, sightingId: string): string {
	return `${articleId}::${sightingId}`;
}

export function linkRecord(
	articleId: string,
	sightingId: string,
	firstSeenAt: string,
	now = new Date().toISOString(),
) {
	return {
		articleId,
		sightingId,
		verification: "unverified" as const,
		firstSeenAt,
		updatedAt: now,
	};
}
