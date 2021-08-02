import defu from "defu";
import type { App } from "vue";
import {
	Client,
	ClientInterface,
	Components,
	ComponentsInterface,
	DOM,
	DOMInterface,
} from "./sdk";
import { PrismicKey, PrismicPluginError, PrismicPluginOptions } from "./types";

const DEFAULTS: Required<PrismicPluginOptions> = {
	endpoint: "",
	apiOptions: {},

	// Default resolver and serializer
	linkResolver: () => "/",
	htmlSerializer: () => null,

	// All kits activated by default
	client: {},
	dom: {},
	components: {},
};

export function createPrismic(options: PrismicPluginOptions): Prismic {
	return new Prismic(options);
}

export type PrismicPluginInterface = Pick<
	Required<PrismicPluginOptions>,
	"endpoint" | "apiOptions" | "linkResolver" | "htmlSerializer"
> &
	ClientInterface &
	DOMInterface &
	ComponentsInterface;

type PartialPrismicPluginInterface = Pick<
	Required<PrismicPluginOptions>,
	"endpoint" | "apiOptions" | "linkResolver" | "htmlSerializer"
> &
	Partial<ClientInterface> &
	Partial<DOMInterface> &
	Partial<ComponentsInterface>;

export class Prismic {
	options: Required<PrismicPluginOptions>;

	client?: Client;
	dom?: DOM;
	components?: Components;

	constructor(options: PrismicPluginOptions) {
		if (!options.endpoint) {
			throw new Error(PrismicPluginError.MissingEndpoint);
		}

		// Resolve options
		this.options = defu<
			Required<PrismicPluginOptions>,
			Required<PrismicPluginOptions>
		>(options as Required<PrismicPluginOptions>, DEFAULTS);

		// Create SDKs
		if (this.options.client) {
			this.client = new Client(this.options);
		}
		if (this.options.dom) {
			this.dom = new DOM(this.options);
		}
		if (this.options.components) {
			this.components = new Components(this.options);
		}
	}

	get interface(): PartialPrismicPluginInterface {
		const { endpoint, apiOptions, linkResolver, htmlSerializer } = this.options;

		return {
			endpoint,
			apiOptions,

			linkResolver,
			htmlSerializer,

			...(this.client?.interface ?? {}),
			...(this.dom?.interface ?? {}),
			...(this.components?.interface ?? {}),
		};
	}

	install(app: App, injectKey?: string): void {
		app.provide(injectKey || PrismicKey, this.interface);
		app.config.globalProperties.$prismic = this.interface;

		this.client?.install(app);
		this.dom?.install(app);
		this.components?.install(app);
	}
}

// This might be potentially wrong when deactivating some kits
declare module "@vue/runtime-core" {
	export interface ComponentCustomProperties {
		$prismic: PrismicPluginInterface;
	}
}
