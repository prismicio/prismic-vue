import defu from "defu";
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

const DEFAULTS: Required<PrismicPluginOptions> = {
  endpoint: "",
  apiOptions: {},
  linkResolver: () => "/",
  htmlSerializer: () => null,
  sdkOptions: {
    client: true,
    dom: true,
    components: {
      link: {
        anchorTag: "a",
        frameworkLink: "router-link",
        blankTargetRelAttribute: "noopener"
      }
    }
  }
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
    this.options = defu<
      Required<PrismicPluginOptions>,
      Required<PrismicPluginOptions>
    >(options as Required<PrismicPluginOptions>, DEFAULTS);

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
