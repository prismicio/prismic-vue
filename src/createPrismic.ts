import type { CreateClient, LinkResolverFunction } from "@prismicio/client"
import { isFilled } from "@prismicio/client"
import type { App, InjectionKey } from "vue"
import { inject } from "vue"

import type { ComponentOrTagName } from "./types"

import type { RichTextComponents } from "./PrismicRichText"
import type { TableComponents } from "./PrismicTable"

const prismicKey = Symbol.for(
	"@prismicio/vue/plugin",
) as InjectionKey<PrismicPlugin>

/** Components configuration. */
type ComponentsConfig = {
	/**
	 * The default link resolver used to resolve links.
	 *
	 * @see {@link https://prismic.io/docs/routes}
	 */
	linkResolver?: LinkResolverFunction

	/** The default component rendered for internal URLs. */
	linkInternalComponent?: ComponentOrTagName

	/** The default component rendered for external URLs. */
	linkExternalComponent?: ComponentOrTagName

	/**
	 * The default components or shorthand definitions for rich text and table
	 * components.
	 *
	 * @see {@link https://prismic.io/docs/fields/rich-text}
	 * @see {@link https://prismic.io/docs/fields/table}
	 */
	defaultComponents?: RichTextComponents & TableComponents
}

/** Prismic Vue plugin configuration. */
export type PrismicPluginConfig = {
	/** A Prismic client instance to inject into the Vue app. */
	client: ReturnType<CreateClient>

	/** Components configuration. */
	components?: ComponentsConfig
}

/**
 * Prismic Vue plugin interface accessible through `usePrismic()` and
 * `$prismic`.
 */
export type PrismicPlugin = {
	/** A Prismic client that can be used to query content from a repository. */
	client: ReturnType<CreateClient>

	/** Helpers to determine if a field is filled. */
	isFilled: typeof isFilled

	/** @internal */
	readonly components: ComponentsConfig

	/** @internal */
	install: (app: App) => void
}

/** Creates a Prismic Vue plugin instance that can be used by a Vue app. */
export const createPrismic = (config: PrismicPluginConfig): PrismicPlugin => {
	return {
		...config,
		components: config.components || {},
		isFilled,
		install(app: App): void {
			app.provide(prismicKey, this)
			app.config.globalProperties.$prismic = this
		},
	}
}

/**
 * Access the Prismic Vue plugin interface.
 *
 * @example
 *
 * ```typescript
 * const { client, isFilled } = usePrismic()
 * ```
 */
export const usePrismic = (): PrismicPlugin => {
	return inject(prismicKey, { components: {} } as PrismicPlugin)
}

declare module "vue" {
	export interface ComponentCustomProperties {
		/** The Prismic Vue plugin interface. */
		$prismic: PrismicPlugin
	}
}
