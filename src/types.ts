import type { App } from "vue";

import type {
	Client,
	ClientConfig,
	cookie,
	predicate,
} from "@prismicio/client";
import type {
	asText,
	asHTML,
	asLink,
	asDate,
	documentAsLink,
	documentToLinkField,
	HTMLFunctionSerializer,
	HTMLMapSerializer,
	LinkResolverFunction,
} from "@prismicio/helpers";

type PrismicPluginOptionsBase = {
	linkResolver?: LinkResolverFunction;
	htmlSerializer?: HTMLFunctionSerializer | HTMLMapSerializer;
};

type PrismicPluginOptionsWithClient = PrismicPluginOptionsBase & {
	client: Client;
};

type PrismicPluginOptionsWithEndpoint = PrismicPluginOptionsBase & {
	endpoint: string;
	clientConfig?: ClientConfig;
};

export type PrismicPluginOptions =
	| PrismicPluginOptionsWithClient
	| PrismicPluginOptionsWithEndpoint;

export type PrismicPluginClient = {
	client: Client;
	predicate: typeof predicate;
	cookie: typeof cookie;
};

export type PrismicPluginHelpers = {
	asText: typeof asText;
	asHTML: typeof asHTML;
	asLink: (
		linkField: Parameters<typeof asLink>[0],
		linkResolver?: LinkResolverFunction,
	) => string | null;
	asDate: typeof asDate;

	documentToLinkField: typeof documentToLinkField;
	documentAsLink: (
		prismicDocument: Parameters<typeof documentAsLink>[0],
		linkResolver?: LinkResolverFunction,
	) => string | null;
};

export type PrismicPlugin = {
	readonly options: PrismicPluginOptions;
	install(app: App, injectKey: string): void;
} & PrismicPluginClient &
	PrismicPluginHelpers;
