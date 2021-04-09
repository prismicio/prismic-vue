import Prismic from "@prismicio/client";
import type { DefaultClient } from "@prismicio/client/types/client";
import type { PrismicPluginOptions } from "../types";
import { SDK, SDKWithInterface, SDKWithInterfaceKeys } from "./SDK";

export type ClientInterface = Omit<Client, SDKWithInterfaceKeys>;

export class Client extends SDK implements SDKWithInterface<ClientInterface> {
  client: DefaultClient;
  previewCookie: string = Prismic.previewCookie;
  Predicates = Prismic.Predicates;

  constructor(options: Required<PrismicPluginOptions>) {
    super(options);
    this.client = Prismic.client(options.endpoint, options.apiOptions);
  }

  get interface(): ClientInterface {
    return {
      client: this.client,
      Predicates: this.Predicates,
      previewCookie: this.previewCookie
    };
  }
}
