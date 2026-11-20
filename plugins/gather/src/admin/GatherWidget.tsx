import { useLingui } from "@lingui/react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch, parseApiResponse } from "emdash/plugin-utils";

interface GatherStatus {
	sources: number;
	sightings: number;
	pending: number;
}

async function loadStatus(fallback: string): Promise<GatherStatus> {
	const response = await apiFetch("/_emdash/api/plugins/gather/status");
	return parseApiResponse<GatherStatus>(response, fallback);
}

export function GatherWidget() {
	const { i18n } = useLingui();
	const { data, isLoading, isError } = useQuery({
		queryKey: ["gather", "status"],
		queryFn: () =>
			loadStatus(
				i18n._({ id: "gather.load-error", message: "Could not load status" }),
			),
	});
	if (isLoading) return <p>…</p>;
	if (isError || !data)
		return (
			<p>
				{i18n._({
					id: "gather.unavailable",
					message: "Gather status unavailable",
				})}
			</p>
		);
	return (
		<p>
			{i18n._({
				id: "gather.status-line",
				message: `{sources} sources · {sightings} sightings · {pending} pending`,
				values: {
					sources: data.sources,
					sightings: data.sightings,
					pending: data.pending,
				},
			})}
		</p>
	);
}
