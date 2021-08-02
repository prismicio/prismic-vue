import type { App } from "vue";
import type { ComponentsOptions, PrismicPluginOptions } from "../types";
import {
	PrismicEmbed,
	PrismicImage,
	PrismicLink,
	PrismicRichText,
} from "../components";
import { SDK, SDKWithInterface } from "./SDK";
import defu from "defu";

export type ComponentsInterface = {
	components: ComponentsOptions;
};

const DEFAULTS: ComponentsOptions = {
	link: {
		anchorTag: "a",
		frameworkLink: "router-link",
		blankTargetRelAttribute: "noopener",
	},
};

export class Components
	extends SDK
	implements SDKWithInterface<ComponentsInterface>
{
	components: ComponentsOptions;

	constructor(options: Required<PrismicPluginOptions>) {
		super(options);

		this.components = defu<ComponentsOptions, ComponentsOptions>(
			options.components as ComponentsOptions,
			DEFAULTS,
		);
	}

	get interface(): ComponentsInterface {
		return {
			components: this.components,
		};
	}

	install(app: App): void {
		app.component(PrismicImage.name, PrismicImage);
		app.component(PrismicEmbed.name, PrismicEmbed);
		app.component(PrismicLink.name, PrismicLink);
		app.component(PrismicRichText.name, PrismicRichText);
	}
}
