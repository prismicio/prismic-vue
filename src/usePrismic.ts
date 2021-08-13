import { inject } from "vue";

import { prismicKey } from "./injectionSymbols";
import { PrismicPlugin } from "./types";

/**
 * Accesses `@prismicio/vue` plugin interface.
 *
 * @returns The interface {@link PrismicPlugin}
 *
 * @example
 * With the composition API:
 *
 * ```
 * import { usePrismic } from "@prismicio/vue";
 *
 * export default {
 *   setup() {
 *     const prismic = usePrismic();
 *
 *     return {}
 *   },
 * };
 * ```
 */
export const usePrismic = (): PrismicPlugin => {
	return inject(prismicKey, { options: { endpoint: "" } } as PrismicPlugin);
};
