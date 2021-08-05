import { inject } from "vue";

import { prismicKey } from "./injectionSymbols";
import { PrismicPlugin } from "./types";

export function usePrismic(): PrismicPlugin {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	return inject(prismicKey)!;
}
