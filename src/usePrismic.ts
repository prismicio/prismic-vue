import { inject } from "vue";

import { prismicKey } from "./injectionSymbols";
import { PrismicPlugin } from "./types";

/**
 * Accesses `@prismicio/vue` plugin interface.
 *
 * @example With the composition API:
 *
 * ```javascript
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
