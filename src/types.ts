import type { App, ConcreteComponent, FunctionalComponent, Ref } from "vue";

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

type PrismicPluginComponentsOptions = {
	linkInternalComponent?: string | ConcreteComponent | FunctionalComponent;
	linkExternalComponent?: string | ConcreteComponent | FunctionalComponent;
	linkBlankTargetRelAttribute?: string;
	imageComponent?: string | ConcreteComponent | FunctionalComponent;
};

type PrismicPluginOptionsBase = {
	linkResolver?: LinkResolverFunction;
	htmlSerializer?: HTMLFunctionSerializer | HTMLMapSerializer;
	injectComponents?: boolean;
	components?: PrismicPluginComponentsOptions;
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
	install: (app: App) => void;
} & PrismicPluginClient &
	PrismicPluginHelpers;

/**
 * States of a `@prismicio/client` composable.
 */
export const enum PrismicClientComposableState {
	/** The composable has not started fetching. */
	Idle = "idle",

	/** The composable is fetching data. */
	Pending = "pending",

	/** The composable sucessfully fetched data. */
	Success = "success",

	/** The composable failed to fetch data. */
	Error = "error",
}

// Helpers

/**
 * Type to transform a static object into one that allows passing Refs as
 * values.
 * @internal
 */
export type VueUseOptions<T> = {
	[k in keyof T]: Ref<T[k]> | T[k];
};
