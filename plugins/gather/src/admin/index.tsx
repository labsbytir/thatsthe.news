import type { PluginAdminExports } from "emdash";
import { GatherPage } from "./GatherPage.js";
import { GatherWidget } from "./GatherWidget.js";

export const pages: PluginAdminExports["pages"] = {
	"/gather": GatherPage,
};

export const widgets: PluginAdminExports["widgets"] = {
	"gather-status": GatherWidget,
};
