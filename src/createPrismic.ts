import { App } from "vue";

import {
	createClient,
	predicate,
	cookie,
	Client,
	FetchLike,
} from "@prismicio/client";
import {
	asText,
	asHTML,
	asLink,
	asDate,
	asImageSrc,
	asImageWidthSrcSet,
	asImagePixelDensitySrcSet,
	documentToLinkField,
} from "@prismicio/helpers";

import {
	PrismicEmbed,
	PrismicImage,
	PrismicLink,
	PrismicRichText,
	PrismicText,
	SliceZone,
} from "./components";
import { prismicKey } from "./injectionSymbols";
import type {
	PrismicPlugin,
	PrismicPluginClient,
	PrismicPluginHelpers,
	PrismicPluginOptions,
} from "./types";

/**
 * Creates a `@prismicio/vue` plugin instance that can be used by a Vue app.
 *
 * @param options - {@link PrismicPluginOptions}
 *
 * @returns `@prismicio/vue` plugin instance {@link PrismicPlugin}
 *
 * @see Prismic Official Vue.js documentation: {@link https://prismic.io/docs/technologies/vuejs}
 * @see Plugin repository: {@link https://github.com/prismicio/prismic-vue}
 */
export const createPrismic = (options: PrismicPluginOptions): PrismicPlugin => {
	// Create plugin client
	let client: Client;
	if (options.client) {
		client = options.client;
	} else {
		client = createClient(options.endpoint, {
			fetch: async (endpoint, options) => {
				let fetchFunction: FetchLike;
				if (typeof globalThis.fetch === "function") {
					// TODO: Remove after https://github.com/prismicio/prismic-client/issues/254
					fetchFunction = globalThis.fetch as FetchLike;
				} else {
					// TODO: Remove after https://github.com/prismicio/prismic-client/issues/254
					fetchFunction = (await import("isomorphic-unfetch"))
						.default as FetchLike;
				}

				return await fetchFunction(endpoint, options);
			},
			...options.clientConfig,
		});
	}

	const prismicClient: PrismicPluginClient = {
		client,
		predicate,
		cookie,
	};

	// Create plugin helpers
	const prismicHelpers: PrismicPluginHelpers = {
		asText,
		asHTML: (richTextField, linkResolver, htmlSerializer) => {
			return asHTML(
				richTextField,
				linkResolver || options.linkResolver,
				htmlSerializer || options.htmlSerializer,
			);
		},
		asLink: (linkField, linkResolver) => {
			return asLink(linkField, linkResolver || options.linkResolver);
		},
		asDate,
		asImageSrc,
		asImageWidthSrcSet,
		asImagePixelDensitySrcSet,
		documentToLinkField,
	};

	// Create plugin interface
	const prismic: PrismicPlugin = {
		options,

		...prismicClient,
		...prismicHelpers,

		install(app: App): void {
			app.provide(prismicKey, this);
			app.config.globalProperties.$prismic = this;

			if (options.injectComponents !== false) {
				app.component(PrismicLink.name, PrismicLink);
				app.component(PrismicEmbed.name, PrismicEmbed);
				app.component(PrismicImage.name, PrismicImage);
				app.component(PrismicText.name, PrismicText);
				app.component(PrismicRichText.name, PrismicRichText);
				app.component(SliceZone.name, SliceZone);
			}
		},
	};

	return prismic;
};
