import type { App } from "vue";
import { Client, ClientInterface, DOM, DOMInterface } from "./sdk";
import { PrismicKey, PrismicPluginError, PrismicPluginOptions } from "./types";

const defaults: Required<PrismicPluginOptions> = {
  endpoint: "",
  apiOptions: {},
  linkResolver: () => "/",
  htmlSerializer: () => null
};

export function createPrismic(options: PrismicPluginOptions): Prismic {
  return new Prismic(options);
}

export type PrismicPluginInterface = Required<PrismicPluginOptions> &
  ClientInterface &
  DOMInterface;

export class Prismic {
  options: Required<PrismicPluginOptions>;
  client: Client;
  dom: DOM;

  constructor(options: PrismicPluginOptions) {
    this.options = { ...defaults, ...options };

    if (!this.options.endpoint) {
      throw new Error(PrismicPluginError.MissingEndpoint);
    }

    this.client = new Client(this.options);
    this.dom = new DOM(this.options);
  }

  get interface(): PrismicPluginInterface {
    return {
      ...this.options,
      ...this.client.interface,
      ...this.dom.interface
    };
  }

  install(app: App, injectKey?: string): void {
    app.provide(injectKey || PrismicKey, this.interface);
    app.config.globalProperties.$prismic = this.interface;
  }
}

declare module "@vue/runtime-core" {
  export interface ComponentCustomProperties {
    $prismic: PrismicPluginInterface;
  }
}
