import { inject } from "vue";
import type { PrismicPluginInterface } from "./Prismic";
import { PrismicKey } from "./types";

export function usePrismic(injectKey?: string): PrismicPluginInterface {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	return inject(injectKey || PrismicKey)!;
}
