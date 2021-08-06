import { inject } from "vue";

import { prismicKey } from "./injectionSymbols";
import { PrismicPlugin } from "./types";

export function usePrismic(): PrismicPlugin {
	return inject(prismicKey) ?? ({ options: { endpoint: "" } } as PrismicPlugin);
}
