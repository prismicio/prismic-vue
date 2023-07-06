import { inject } from "vue";

import { PrismicPlugin } from "./types";

import { prismicKey } from "./injectionSymbols";

/**
 * Accesses `@prismicio/vue` plugin interface.
 *
 * @example
 *
 * ```javascript
 * // With the composition API
 * import { usePrismic } from "@prismicio/vue";
 *
 * export default {
 * 	setup() {
 * 		const prismic = usePrismic();
 *
 * 		return {};
 * 	},
 * };
 * ```
 *
 * @returns The interface {@link PrismicPlugin}
 */
export const usePrismic = (): PrismicPlugin => {
	return inject(prismicKey, { options: { endpoint: "" } } as PrismicPlugin);
};
