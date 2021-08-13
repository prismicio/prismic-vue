import type { PrismicPlugin } from "./types";

declare module "@vue/runtime-core" {
	export interface ComponentCustomProperties {
		/**
		 * `@prismicio/vue` plugin interface exposed on `this`.
		 *
		 * @see `@prismicio/vue` plugin interface {@link PrismicPlugin}
		 */
		$prismic: PrismicPlugin;
	}
}
