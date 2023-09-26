import type {
	ClientConfig,
	CreateClient,
	HTMLRichTextFunctionSerializer,
	HTMLRichTextMapSerializer,
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
	documentToLinkField,
	filter,
	isFilled,
} from "@prismicio/client";
import type { App, ConcreteComponent, DefineComponent, Raw, Ref } from "vue";

/* eslint-disable @typescript-eslint/no-unused-vars */
// Imports for @link references:
import type { RouterLink } from "vue-router";

import type {
	SliceComponentProps,
	SliceComponentType,
	TODOSliceComponent,
} from "./components/SliceZone";

import type { usePrismicDocuments } from "./composables";

/* eslint-enable @typescript-eslint/no-unused-vars */

/**
 * Options used by `@prismicio/vue` components.
 */
type PrismicPluginComponentsOptions = {
	/**
	 * Value of the `rel` attribute to use on links rendered with
	 * `target="_blank"`
	 *
	 * @defaultValue `"noopener noreferrer"`
	 */
	linkBlankTargetRelAttribute?: string;

	/**
	 * An HTML tag name, a component, or a functional component used to render
	 * internal links.
	 *
	 * @remarks
	 * HTML tag names will be rendered using the anchor tag interface (`href`,
	 * `target`, and `rel` attributes).
	 * @remarks
	 * Components will be rendered using Vue Router {@link RouterLink} interface
	 * (`to` props).
	 * @defaultValue {@link RouterLink}
	 */
	linkInternalComponent?: string | ConcreteComponent | Raw<DefineComponent>;

	/**
	 * An HTML tag name, a component, or a functional component used to render
	 * external links.
	 *
	 * @remarks
	 * HTML tag names will be rendered using the anchor tag interface (`href`,
	 * `target`, and `rel` attributes).
	 * @remarks
	 * Components will be rendered using Vue Router {@link RouterLink} interface
	 * (`to` props).
	 * @defaultValue `"a"`
	 */
	linkExternalComponent?: string | ConcreteComponent | Raw<DefineComponent>;

	/**
	 * An HTML tag name, a component, or a functional component used to render
	 * images.
	 *
	 * @remarks
	 * HTML tag names and components will be rendered using the `img` tag
	 * interface (`src` and `alt` attribute). Components will also receive an
	 * additional `copyright` props.
	 * @defaultValue `"img"`
	 */
	imageComponent?: string | ConcreteComponent | Raw<DefineComponent>;

	/**
	 * Default widths to use when rendering an image with `widths="defaults"`
	 *
	 * @remarks
	 * Consider configuring image widths within your content type definition and
	 * using `widths="auto"` instead to give content writers the ability to crop
	 * images in the editor.
	 * @defaultValue `@prismicio/client` defaults
	 */
	imageWidthSrcSetDefaults?: number[];

	/**
	 * Default pixel densities to use when rendering an image with
	 * `pixel-densities="defaults"`
	 *
	 * @defaultValue `@prismicio/client` defaults
	 */
	imagePixelDensitySrcSetDefaults?: number[];

	/**
	 * A component or a functional component rendered if a component mapping from
	 * the `components` prop cannot be found.
	 *
	 * @remarks
	 * Components will be rendered using the {@link SliceComponentProps} interface.
	 *
	 * @defaultValue `null` when `process.env.NODE_ENV === "production"` else {@link TODOSliceComponent}
	 */
	sliceZoneDefaultComponent?: SliceComponentType;
};

/**
 * Common options supported by `@prismicio/vue` plugin.
 */
type PrismicPluginOptionsBase = {
	/**
	 * An optional link resolver function used to resolve links to Prismic
	 * documents when not using the route resolver parameter with
	 * `@prismicio/client`.
	 *
	 * @see Link resolver documentation {@link https://prismic.io/docs/core-concepts/link-resolver-route-resolver#link-resolver}
	 */
	linkResolver?: LinkResolverFunction;

	/**
	 * An optional HTML serializer to customize the way rich text fields are
	 * rendered.
	 *
	 * @see HTML serializer documentation {@link https://prismic.io/docs/core-concepts/html-serializer}
	 */
	richTextSerializer?:
		| HTMLRichTextFunctionSerializer
		| HTMLRichTextMapSerializer;

	/**
	 * An optional HTML serializer to customize the way rich text fields are
	 * rendered.
	 *
	 * @deprecated Use `richTextSerializer` instead.
	 *
	 * @see HTML serializer documentation {@link https://prismic.io/docs/core-concepts/html-serializer}
	 */
	// TODO: Remove in v5
	htmlSerializer?: HTMLRichTextFunctionSerializer | HTMLRichTextMapSerializer;

	/**
	 * Whether or not to inject components globally.
	 *
	 * @defaultValue `true`
	 */
	injectComponents?: boolean;

	/**
	 * Options used by Prismic Vue components.
	 *
	 * @see Components options {@link PrismicPluginComponentsOptions}
	 */
	components?: PrismicPluginComponentsOptions;
};

/**
 * Options to init `@prismicio/vue` plugin with a client instance.
 *
 * @see {@link PrismicPluginOptionsBase} for shared options
 */
type PrismicPluginOptionsWithClient = PrismicPluginOptionsBase & {
	/**
	 * A `@prismicio/client` instance used to fetch content from a Prismic
	 * repository to configure the plugin with.
	 *
	 * @remarks
	 * The client will be used by `@prismicio/vue` composables, such as
	 * {@link usePrismicDocuments} and exposed through `this.$prismic.client` and
	 * `usePrismic().client`.
	 * @see Prismic client documentation {@link https://prismic.io/docs/technologies/javascript}
	 */
	client: ReturnType<CreateClient>;

	/**
	 * Ensures type union is a strict or.
	 *
	 * @internal
	 */
	endpoint?: never;

	/**
	 * Ensures type union is a strict or.
	 *
	 * @internal
	 */
	clientConfig?: never;
};

/**
 * Options to init `@prismicio/vue` plugin with a repository ID or API endpoint.
 *
 * @see {@link PrismicPluginOptionsBase} for shared options
 */
type PrismicPluginOptionsWithEndpoint = PrismicPluginOptionsBase & {
	/**
	 * A Prismic repository endpoint to init the plugin's `@prismicio/client`
	 * instance used to fetch content from a Prismic repository with.
	 *
	 * @remarks
	 * Said client will be used by `@prismicio/vue` composables, such as
	 * {@link usePrismicDocuments} and exposed through `this.$prismic.client` and
	 * `usePrismic().client`.
	 * @example
	 *
	 * ```javascript
	 * // A repository ID
	 * "my-repo";
	 *
	 * //A full repository endpoint
	 * "https://my-repo.cdn.prismic.io/api/v2";
	 * ```
	 *
	 * @see Prismic client documentation {@link https://prismic.io/docs/technologies/javascript}
	 */
	endpoint: string;

	/**
	 * An optional object to configure `@prismicio/client` instance further.
	 *
	 * @example
	 *
	 * ```javascript
	 * // Accessing a private private repository
	 * {
	 * 	"accessToken": "abc"
	 * }
	 * ```
	 *
	 * @example
	 *
	 * ```javascript
	 * // Using a route resolver
	 * {
	 * 	"defaultParams": {
	 * 		"routes": [
	 * 			{
	 * 				"type": "page",
	 * 				"path": "/:uid"
	 * 			},
	 * 			{
	 * 				"type": "post",
	 * 				"path": "/blog/:uid"
	 * 			}
	 * 		]
	 * 	}
	 * }
	 * ```
	 *
	 * @see Prismic client documentation {@link https://prismic.io/docs/technologies/javascript}
	 * @see Route resolver documentation {@link https://prismic.io/docs/core-concepts/link-resolver-route-resolver#route-resolver}
	 */
	clientConfig?: ClientConfig;

	/**
	 * Ensures type union is a strict or.
	 *
	 * @internal
	 */
	client?: never;
};

/**
 * `@prismicio/vue` plugin options.
 *
 * @see Prismic Official Vue.js documentation: {@link https://prismic.io/docs/technologies/vuejs}
 * @see Plugin repository: {@link https://github.com/prismicio/prismic-vue}
 */
export type PrismicPluginOptions =
	| PrismicPluginOptionsWithClient
	| PrismicPluginOptionsWithEndpoint;

/**
 * `@prismicio/client` related methods and properties exposed by
 * `@prismicio/vue` plugin and accessible through `this.$prismic` and
 * `usePrismic()`.
 */
export type PrismicPluginClient = {
	/**
	 * A `@prismicio/client` instance.
	 */
	client: ReturnType<CreateClient>;

	/**
	 * Query filters from `@prismicio/client`.
	 */
	filter: typeof filter;

	/**
	 * Prismic cookies from `@prismicio/client`.
	 */
	cookie: typeof cookie;
};

/**
 * `@prismicio/client` related methods exposed by `@prismicio/vue` plugin and
 * accessible through `this.$prismic` and `usePrismic()`.
 */
export type PrismicPluginHelpers = {
	/**
	 * Serializes a rich text or title field to a plain text string. This is
	 * `@prismicio/client` {@link asText} function.
	 *
	 * @see Templating rich text and title fields {@link https://prismic.io/docs/technologies/vue-template-content#rich-text-and-titles}
	 */
	asText: typeof asText;

	/**
	 * Serializes a rich text or title field to an HTML string. This is
	 * `@prismicio/client` {@link asHTML} function.
	 *
	 * @remarks
	 * If no `linkResolver` is provided the function will use the one provided to
	 * the plugin at {@link PrismicPluginOptions.linkResolver} if available.
	 * @remarks
	 * If no `htmlSerializer` is provided the function will use the one provided
	 * to the plugin at {@link PrismicPluginOptions.htmlSerializer} if available.
	 * @see Templating rich text and title fields {@link https://prismic.io/docs/technologies/vue-template-content#rich-text-and-titles}
	 */
	asHTML: typeof asHTML;

	/**
	 * Resolves any type of link field or document to a URL. This is
	 * `@prismicio/client` {@link asLink} function.
	 *
	 * @remarks
	 * If no `linkResolver` is provided the function will use the one provided to
	 * the plugin at {@link PrismicPluginOptions.linkResolver} if available.
	 * @see Templating link fields {@link https://prismic.io/docs/technologies/vue-template-content#links-and-content-relationships}
	 */
	asLink: typeof asLink;

	/**
	 * Resolves any type of link field or document to a set of link attributes.
	 * This is `@prismicio/client` {@link asLinkAttrs} function.
	 *
	 * @remarks
	 * If no `linkResolver` is provided the function will use the one provided to
	 * the plugin at {@link PrismicPluginOptions.linkResolver} if available.
	 * @see Templating link fields {@link https://prismic.io/docs/technologies/vue-template-content#links-and-content-relationships}
	 */
	asLinkAttrs: typeof asLinkAttrs;

	/**
	 * Transforms a date or timestamp field into a JavaScript Date object. This is
	 * `@prismicio/client` {@link asDate} function.
	 */
	asDate: typeof asDate;

	/**
	 * Returns the URL of an Image field with optional image transformations (via
	 * Imgix URL parameters). This is `@prismicio/client` {@link asImageSrc}
	 * function.
	 */
	asImageSrc: typeof asImageSrc;

	/**
	 * Creates a width-based `srcset` from an Image field with optional image
	 * transformations (via Imgix URL parameters). This is `@prismicio/client`
	 * {@link asImageWidthSrcSet} function.
	 */
	asImageWidthSrcSet: typeof asImageWidthSrcSet;

	/**
	 * Creates a pixel-density-based `srcset` from an Image field with optional
	 * image transformations (via Imgix URL parameters). This is
	 * `@prismicio/client` {@link asImagePixelDensitySrcSet} function.
	 */
	asImagePixelDensitySrcSet: typeof asImagePixelDensitySrcSet;

	/**
	 * Helpers to determine if a field is filled. This is `@prismicio/client`
	 * {@link isFilled} object.
	 */
	isFilled: typeof isFilled;

	/**
	 * Converts a document into a link field. This is `@prismicio/client`
	 * {@link documentToLinkField} function.
	 *
	 * @internal
	 */
	documentToLinkField: typeof documentToLinkField;
};

/**
 * Methods and properties exposed by `@prismicio/vue` plugin and accessible
 * through `this.$prismic` and `usePrismic()`.
 */
export type PrismicPlugin = {
	/**
	 * Options uses to initialize the plugin.
	 *
	 * @see `@prismicio/vue` plugin options {@link PrismicPluginOptions}
	 */
	readonly options: PrismicPluginOptions;

	/**
	 * `@prismicio/vue` plugin install function used by Vue.
	 *
	 * @internal
	 */
	install: (app: App) => void;
} & PrismicPluginClient &
	PrismicPluginHelpers;

/**
 * States of a `@prismicio/client` composable.
 */
export const enum PrismicClientComposableState {
	/**
	 * The composable has not started fetching.
	 */
	Idle = "idle",

	/**
	 * The composable is fetching data.
	 */
	Pending = "pending",

	/**
	 * The composable sucessfully fetched data.
	 */
	Success = "success",

	/**
	 * The composable failed to fetch data.
	 */
	Error = "error",
}

// Helpers

/**
 * Type to transform a static object into one that allows passing Refs as
 * values.
 *
 * @internal
 */
export type VueUseOptions<T> = {
	[K in keyof T]: Ref<T[K]> | T[K];
};

/**
 * Type to transform a static tuple into one that allows passing Refs as values.
 *
 * @internal
 */
export type VueUseParameters<T> = {
	[K in keyof T]: T extends number ? Ref<T[K]> | T[K] : T[K];
};
