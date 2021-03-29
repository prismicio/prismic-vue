import type { App } from "vue";
import {
  Client,
  ClientInterface,
  Components,
  ComponentsInterface,
  DOM,
  DOMInterface
} from "./sdk";
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
  DOMInterface &
  ComponentsInterface;

export class Prismic {
  options: Required<PrismicPluginOptions>;
  client: Client;
  dom: DOM;
  components: Components;

  constructor(options: PrismicPluginOptions) {
    this.options = { ...defaults, ...options };

    if (!this.options.endpoint) {
      throw new Error(PrismicPluginError.MissingEndpoint);
    }

    this.client = new Client(this.options);
    this.dom = new DOM(this.options);
    this.components = new Components(this.options);
  }

  get interface(): PrismicPluginInterface {
    return {
      ...this.options,
      ...this.client.interface,
      ...this.dom.interface,
      ...this.components.interface
    };
  }

  install(app: App, injectKey?: string): void {
    app.provide(injectKey || PrismicKey, this.interface);
    app.config.globalProperties.$prismic = this.interface;

    this.client.install(app);
    this.dom.install(app);
    this.components.install(app);
  }
}

declare module "@vue/runtime-core" {
  export interface ComponentCustomProperties {
    $prismic: PrismicPluginInterface;
  }
}
