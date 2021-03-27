import Prismic from "@prismicio/client";
import type { DefaultClient } from "@prismicio/client/types/client";
import type { SdkWithInterface, PrismicPluginOptions } from "../types";

export type ClientInterface = Omit<Client, "interface" | "options">;

export class Client implements SdkWithInterface<ClientInterface> {
  client: DefaultClient;
  previewCookie: string = Prismic.previewCookie;
  Predicates = Prismic.Predicates;

  constructor(public options: Required<PrismicPluginOptions>) {
    this.client = Prismic.client(options.endpoint, options.apiOptions);
  }

  get interface(): ClientInterface {
    return {
      client: this.client,
      previewCookie: this.previewCookie,
      Predicates: this.Predicates
    };
  }
}
