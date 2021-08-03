import type { InjectionKey } from "vue";

import type { PrismicPlugin } from "./types";

export const prismicKey = Symbol("prismic") as InjectionKey<PrismicPlugin>;
