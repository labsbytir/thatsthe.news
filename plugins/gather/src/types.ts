/** Shared record shapes for the Gather plugin. */

export type VerificationState =
	| "unverified"
	| "corroborated"
	| "verified"
	| "disputed";

export interface GatherSource {
	/** Canonical domain, e.g. "example.com". Record ID. */
	domain: string;
	name: string;
	homepage: string;
	feedUrl: string | null;
	collection: string | null;
	country: string | null;
	lastPolledAt: string | null;
	lastError: string | null;
}

export interface GatherSighting {
	/** Canonical story URL. Record ID. */
	canonicalUrl: string;
	sourceId: string;
	url: string;
	title: string;
	publishedAt: string | null;
	firstSeenAt: string;
}

export interface GatherLink {
	articleId: string;
	sightingId: string;
	verification: VerificationState;
	firstSeenAt: string;
	updatedAt: string;
}

export const VERIFICATION_STATES: VerificationState[] = [
	"unverified",
	"corroborated",
	"verified",
	"disputed",
];

export function isVerificationState(value: unknown): value is VerificationState {
	return (
		typeof value === "string" &&
		(VERIFICATION_STATES as string[]).includes(value)
	);
}
