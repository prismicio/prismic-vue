import type { PrismicPlugin } from "./types";

declare module "@vue/runtime-core" {
	export interface ComponentCustomProperties {
		$prismic: PrismicPlugin;
	}
}
