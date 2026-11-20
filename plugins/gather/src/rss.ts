/** Minimal RSS2 / Atom / sitemap parsing. Dependency-free by design. */

export interface FeedItem {
	url: string;
	title: string;
	publishedAt: string | null;
}

const MAX_ITEMS = 100;

function stripCdata(value: string): string {
	return value.replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1").trim();
}

function decodeEntities(value: string): string {
	return stripCdata(value)
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, '"')
		.replace(/&#39;|&apos;/g, "'");
}

function pickBlock(xml: string, tag: string): string[] {
	const out: string[] = [];
	const re = new RegExp(`<${tag}[\\s>]([\\s\\S]*?)<\\/${tag}>`, "gi");
	let match: RegExpExecArray | null;
	while ((match = re.exec(xml)) !== null && out.length < MAX_ITEMS) {
		out.push(match[1]);
	}
	return out;
}

function pickField(block: string, tag: string): string | null {
	const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
	const match = re.exec(block);
	return match ? decodeEntities(match[1]) : null;
}

function pickLinkHref(block: string): string | null {
	const patterns = [
		/<link[^>]*href=["']([^"']+)["'][^>]*\/?>/i,
		/<link[^>]*>([\s\S]*?)<\/link>/i,
		/<loc[^>]*>([\s\S]*?)<\/loc>/i,
	];
	for (const re of patterns) {
		const match = re.exec(block);
		if (match) {
			const value = decodeEntities(match[1]);
			if (value.startsWith("http")) return value;
		}
	}
	return null;
}

function pickDate(block: string): string | null {
	for (const tag of ["pubDate", "published", "updated", "lastmod"]) {
		const raw = pickField(block, tag);
		if (!raw) continue;
		const time = Date.parse(raw);
		if (!Number.isNaN(time)) return new Date(time).toISOString();
	}
	return null;
}

/** Parse feed XML into story candidates. Unknown shapes yield []. */
export function parseFeedItems(xml: string): FeedItem[] {
	const items: FeedItem[] = [];
	const seen = new Set<string>();
	const blocks = [
		...pickBlock(xml, "item"),
		...pickBlock(xml, "entry"),
		...pickBlock(xml, "url"),
	];
	for (const block of blocks) {
		const url = pickLinkHref(block);
		if (!url || seen.has(url)) continue;
		seen.add(url);
		items.push({
			url,
			title: pickField(block, "title") ?? url,
			publishedAt: pickDate(block),
		});
		if (items.length >= MAX_ITEMS) break;
	}
	return items;
}
