import type { InjectionKey } from "vue";

import type { PrismicPlugin } from "./types";

/* eslint-disable @typescript-eslint/no-unused-vars */
// Imports for @link references:
import type { usePrismic } from "./usePrismic";

/* eslint-enable @typescript-eslint/no-unused-vars */

/**
 * `@prismicio/vue` plugin interface interface location used for
 * {@link usePrismic}.
 *
 * @internal
 */
export const prismicKey = Symbol("prismic") as InjectionKey<PrismicPlugin>;
