import type { App } from "vue";
import type { PrismicPluginOptions } from "../types";
import { PrismicEmbed, PrismicImage } from "../components";
import { SDK, SDKWithInterface } from "./SDK";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ComponentsInterface {}

export class Components
  extends SDK
  implements SDKWithInterface<ComponentsInterface> {
  constructor(options: Required<PrismicPluginOptions>) {
    super(options);
  }

  get interface(): ComponentsInterface {
    return {};
  }

  install(app: App): void {
    app.component(PrismicImage.name, PrismicImage);
    app.component(PrismicEmbed.name, PrismicEmbed);
  }
}
