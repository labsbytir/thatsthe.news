/** Shared Gather feed fetch for server-rendered pages. */

export interface GatherFeedEntry {
	articleId: string;
	sightingId: string;
	verification: "unverified" | "corroborated" | "verified" | "disputed";
	firstSeenAt: string;
	title: string;
	url: string | null;
	sourceId: string | null;
	first: boolean;
}

/** Oldest-first entries for one article. `reachable` is false when the feed errored. */
export async function getGatherFeed(
	origin: string,
	articleId: string,
): Promise<{ entries: GatherFeedEntry[]; reachable: boolean }> {
	try {
		const res = await fetch(
			`${origin}/_emdash/api/plugins/gather/feed?articleId=${encodeURIComponent(articleId)}`,
		);
		if (!res.ok) return { entries: [], reachable: false };
		const payload = (await res.json()) as {
			success: boolean;
			data?: { ok: boolean; entries?: GatherFeedEntry[] };
		};
		if (!payload.success || !payload.data?.ok)
			return { entries: [], reachable: false };
		return { entries: payload.data.entries ?? [], reachable: true };
	} catch {
		return { entries: [], reachable: false };
	}
}

export interface GatherDirectoryEntry {
	domain: string;
	name: string;
	homepage: string;
	collection: string | null;
}

/** Monitored sources for the public registry page. */
export async function getGatherDirectory(
	origin: string,
): Promise<GatherDirectoryEntry[]> {
	try {
		const res = await fetch(`${origin}/_emdash/api/plugins/gather/directory`);
		if (!res.ok) return [];
		const payload = (await res.json()) as {
			success: boolean;
			data?: { items?: GatherDirectoryEntry[] };
		};
		if (!payload.success) return [];
		return payload.data?.items ?? [];
	} catch {
		return [];
	}
}
