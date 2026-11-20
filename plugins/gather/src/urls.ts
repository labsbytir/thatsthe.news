/** Canonical story URLs so repeat polls never create duplicate sightings. */

const TRACKING_PARAMS = new Set([
	"utm_source",
	"utm_medium",
	"utm_campaign",
	"utm_term",
	"utm_content",
	"utm_id",
	"gclid",
	"fbclid",
	"msclkid",
	"mc_cid",
	"mc_eid",
	"igshid",
]);

/** Normalize a story URL for dedupe. Returns null when the value is not an http(s) URL. */
export function canonicalStoryUrl(raw: string): string | null {
	let url: URL;
	try {
		url = new URL(raw.trim());
	} catch {
		return null;
	}
	if (url.protocol !== "http:" && url.protocol !== "https:") return null;
	let host = url.hostname.toLowerCase();
	if (host.startsWith("www.")) host = host.slice(4);
	let path = url.pathname;
	if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
	const params = new URLSearchParams();
	for (const [key, value] of url.searchParams) {
		if (!TRACKING_PARAMS.has(key.toLowerCase())) params.append(key, value);
	}
	const query = params.toString();
	return `${host}${path}${query ? `?${query}` : ""}`;
}

/** Normalize a source domain for use as a registry record ID. */
export function canonicalDomain(raw: string): string | null {
	const trimmed = raw.trim().toLowerCase();
	const host = trimmed.includes("://")
		? (() => {
				try {
					return new URL(trimmed).hostname.toLowerCase();
				} catch {
					return null;
				}
			})()
		: trimmed.split("/")[0];
	if (!host || !host.includes(".")) return null;
	return host.startsWith("www.") ? host.slice(4) : host;
}
