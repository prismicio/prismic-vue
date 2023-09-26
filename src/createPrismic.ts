import {
	Client,
	FetchLike,
	LinkResolverFunction,
	asDate,
	asHTML,
	asImagePixelDensitySrcSet,
	asImageSrc,
	asImageWidthSrcSet,
	asLink,
	asLinkAttrs,
	asText,
	cookie,
	createClient,
	documentToLinkField,
	filter,
	isFilled,
} from "@prismicio/client";
import { App } from "vue";

import type {
	PrismicPlugin,
	PrismicPluginClient,
	PrismicPluginHelpers,
	PrismicPluginOptions,
} from "./types";

import {
	PrismicEmbed,
	PrismicImage,
	PrismicLink,
	PrismicRichText,
	PrismicText,
	SliceZone,
} from "./components";
import { prismicKey } from "./injectionSymbols";

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
					fetchFunction = globalThis.fetch;
				} else {
					fetchFunction = (await import("isomorphic-unfetch")).default;
				}

				return await fetchFunction(endpoint, options);
			},
			...options.clientConfig,
		});
	}

	const prismicClient: PrismicPluginClient = {
		client,
		filter,
		cookie,
	};

	// Create plugin helpers
	const prismicHelpers: PrismicPluginHelpers = {
		asText,
		asHTML: (richTextField, ...config) => {
			const [configOrLinkResolver, maybeHTMLSerializer] = config;

			return asHTML(
				richTextField,
				typeof configOrLinkResolver === "function" ||
					configOrLinkResolver == null
					? {
							linkResolver: configOrLinkResolver || options.linkResolver,
							serializer:
								maybeHTMLSerializer ||
								options.richTextSerializer ||
								options.htmlSerializer,
					  }
					: {
							linkResolver: options.linkResolver,
							serializer: options.richTextSerializer || options.htmlSerializer,
							...configOrLinkResolver,
					  },
			);
		},
		asLink: (linkField, config) => {
			return asLink(
				linkField,
				typeof config === "function"
					? { linkResolver: config }
					: {
							linkResolver: options.linkResolver,
							// TODO: For some reasons, TypeScript narrows the type to "unknown" where it's supposed to be a union
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
							...(config as any),
					  },
			);
		},
		asLinkAttrs: (linkField, config) => {
			return asLinkAttrs(linkField, {
				// TODO: We can't really retrieve the generic type here, this might cause some unexpected type error in some edge-case scenario
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				linkResolver: options.linkResolver as LinkResolverFunction<any>,
				...config,
			});
		},
		asDate,
		asImageSrc,
		asImageWidthSrcSet,
		asImagePixelDensitySrcSet,
		isFilled,
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
