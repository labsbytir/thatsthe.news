import { Button, Loader } from "@cloudflare/kumo";
import { useLingui } from "@lingui/react";
import { apiFetch, parseApiResponse } from "emdash/plugin-utils";
import * as React from "react";

interface SourceRow {
	domain: string;
	name: string;
	homepage: string;
	feedUrl: string | null;
	collection: string | null;
	lastPolledAt: string | null;
	lastError: string | null;
}

interface QueueEntry {
	articleId: string;
	sightingId: string;
	title: string;
	url: string | null;
	sourceId: string | null;
	verification: string;
	firstSeenAt: string;
}

async function loadSources(): Promise<SourceRow[]> {
	const response = await apiFetch(
		"/_emdash/api/plugins/gather/sources?limit=100",
	);
	const data = await parseApiResponse<{ items: SourceRow[] }>(
		response,
		"Could not load sources",
	);
	return data.items;
}

async function loadQueue(): Promise<QueueEntry[]> {
	const response = await apiFetch("/_emdash/api/plugins/gather/queue");
	const data = await parseApiResponse<{ entries: QueueEntry[] }>(
		response,
		"Could not load verification queue",
	);
	return data.entries;
}

async function verify(
	articleId: string,
	sightingId: string,
	verification: "verified" | "disputed",
): Promise<void> {
	const response = await apiFetch("/_emdash/api/plugins/gather/verify", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ articleId, sightingId, verification }),
	});
	await parseApiResponse<{ ok: boolean }>(response, "Verification failed");
}

export function GatherPage() {
	const { i18n } = useLingui();
	const [sources, setSources] = React.useState<SourceRow[] | null>(null);
	const [queue, setQueue] = React.useState<QueueEntry[] | null>(null);
	const [error, setError] = React.useState<string | null>(null);
	const [busy, setBusy] = React.useState<string | null>(null);

	const refresh = React.useCallback(async () => {
		setError(null);
		try {
			const [s, q] = await Promise.all([loadSources(), loadQueue()]);
			setSources(s);
			setQueue(q);
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : String(cause));
		}
	}, []);

	React.useEffect(() => {
		void refresh();
	}, [refresh]);

	const onVerify = React.useCallback(
		async (
			entry: QueueEntry,
			verification: "verified" | "disputed",
		) => {
			const key = `${entry.articleId}::${entry.sightingId}`;
			setBusy(key);
			setError(null);
			try {
				await verify(entry.articleId, entry.sightingId, verification);
				await refresh();
			} catch (cause) {
				setError(cause instanceof Error ? cause.message : String(cause));
			} finally {
				setBusy(null);
			}
		},
		[refresh],
	);

	return (
		<section className="space-y-8">
			<div>
				<h1 className="text-2xl font-semibold">
					{i18n._({ id: "gather.title", message: "Gather" })}
				</h1>
				<p className="text-sm text-kumo-subtle">
					{i18n._({
						id: "gather.subtitle",
						message: "Monitored sources and the verification queue.",
					})}
				</p>
			</div>
			{error && (
				<p role="alert" className="text-kumo-danger">
					{error}
				</p>
			)}
			{sources === null || queue === null ? (
				<Loader />
			) : (
				<>
					<div>
						<h2 className="text-lg font-semibold">
							{i18n._({
								id: "gather.queue",
								message: `Verification queue (${queue.length})`,
							})}
						</h2>
						{queue.length === 0 ? (
							<p className="text-sm text-kumo-subtle">
								{i18n._({
									id: "gather.queue-empty",
									message: "Nothing awaiting verification.",
								})}
							</p>
						) : (
							<ul className="space-y-2">
								{queue.map((entry) => {
									const key = `${entry.articleId}::${entry.sightingId}`;
									return (
										<li key={key} className="flex flex-wrap items-center gap-2">
											<span className="font-medium">{entry.title}</span>
											<span className="text-sm text-kumo-subtle">
												{entry.sourceId ?? "unknown"} ·{" "}
												{entry.firstSeenAt.slice(0, 10)}
											</span>
											<Button
												type="button"
												disabled={busy === key}
												onClick={() => void onVerify(entry, "verified")}
											>
												{i18n._({
													id: "gather.verify",
													message: "Verify",
												})}
											</Button>
											<Button
												type="button"
												disabled={busy === key}
												onClick={() => void onVerify(entry, "disputed")}
											>
												{i18n._({
													id: "gather.dispute",
													message: "Dispute",
												})}
											</Button>
										</li>
									);
								})}
							</ul>
						)}
					</div>
					<div>
						<h2 className="text-lg font-semibold">
							{i18n._({
								id: "gather.sources",
								message: `Sources (${sources.length})`,
							})}
						</h2>
						{sources.length === 0 ? (
							<p className="text-sm text-kumo-subtle">
								{i18n._({
									id: "gather.sources-empty",
									message:
										"No sources yet. Add a MediaCloud API key in Gather settings to sync the directory.",
								})}
							</p>
						) : (
							<ul className="space-y-1">
								{sources.map((source) => (
									<li key={source.domain} className="text-sm">
										<span className="font-medium">{source.name}</span>{" "}
										<span className="text-kumo-subtle">
											{source.domain}
											{source.collection
												? ` · ${source.collection}`
												: ""}
											{source.lastError
												? ` · error: ${source.lastError}`
												: ""}
										</span>
									</li>
								))}
							</ul>
						)}
					</div>
					<Button type="button" onClick={() => void refresh()}>
						{i18n._({ id: "gather.refresh", message: "Refresh" })}
					</Button>
				</>
			)}
		</section>
	);
}
