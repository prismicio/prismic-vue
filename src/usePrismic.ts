import { inject } from "vue";
import { Prismic } from "./Prismic";
import { PrismicKey } from "./types";

export function usePrismic(injectKey?: string): Prismic {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return inject(injectKey || PrismicKey)!;
}
