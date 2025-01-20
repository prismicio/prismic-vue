import type { InjectionKey } from "vue"
import { inject } from "vue"

import type { PrismicPlugin } from "./types"

/**
 * `@prismicio/vue` plugin interface interface location used for
 * {@link usePrismic}.
 *
 * @internal
 */
export const prismicKey = Symbol("prismic") as InjectionKey<PrismicPlugin>

/**
 * Accesses `@prismicio/vue` plugin interface.
 *
 * @example
 *
 * ```javascript
 * // With the composition API
 * import { usePrismic } from "@prismicio/vue"
 *
 * export default {
 * 	setup() {
 * 		const prismic = usePrismic()
 *
 * 		return {}
 * 	},
 * }
 * ```
 *
 * @returns The interface {@link PrismicPlugin}
 */
export const usePrismic = (): PrismicPlugin => {
	return inject(prismicKey, { options: { endpoint: "" } } as PrismicPlugin)
}
