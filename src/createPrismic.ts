import { App } from "vue";
import nodeFetch from "node-fetch";

import {
	createClient,
	getEndpoint,
	predicate,
	cookie,
} from "@prismicio/client";
import {
	asDate,
	asHTML,
	asLink,
	asText,
	documentToLinkField,
	documentAsLink,
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

export const createPrismic = (options: PrismicPluginOptions): PrismicPlugin => {
	// Creating plugin client
	const prismicClient: PrismicPluginClient = {
		client:
			"client" in options
				? options.client
				: createClient(
						/** @see Regex101 expression: {@link https://regex101.com/r/GT2cl7/1} */
						/^(https?:)?\/\//gim.test(options.endpoint)
							? options.endpoint
							: getEndpoint(options.endpoint),
						{
							fetch: nodeFetch,
							...options.clientConfig,
						},
				  ),
		predicate,
		cookie,
	};

	// Creating plugin helpers
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

		documentToLinkField,
		documentAsLink: (prismicDocument, linkResolver) => {
			return documentAsLink(
				prismicDocument,
				linkResolver || options.linkResolver,
			);
		},
	};

	// Creating plugin instance
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
