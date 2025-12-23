import type { CreateClient } from "@prismicio/client"
import { isFilled } from "@prismicio/client"
import { type App, type InjectionKey, inject } from "vue"

import type { ComponentOrTagName } from "./types"

import type { VueRichTextComponents } from "./PrismicRichText"
import type { VueTableComponents } from "./PrismicTable"

const prismicKey = Symbol.for(
	"@prismicio/vue/plugin",
) as InjectionKey<PrismicPlugin>

/** Components configuration. */
type ComponentsConfig = {
	/** The default component rendered for internal URLs. */
	linkInternalComponent?: ComponentOrTagName

	/** The default component rendered for external URLs. */
	linkExternalComponent?: ComponentOrTagName

	/**
	 * The default components or shorthand definitions for Rich Text and Table
	 * fields.
	 */
	defaultComponents?: VueRichTextComponents & VueTableComponents
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
	readonly componentsConfig?: ComponentsConfig

	/** @internal */
	install: (app: App) => void
}

/** Prismic Vue plugin configuration. */
export type PrismicPluginConfig = {
	/** A Prismic client instance to inject into the Vue app. */
	client: ReturnType<CreateClient>

	/** Components configuration. */
	componentsConfig?: ComponentsConfig
}

/** Creates a Prismic Vue plugin instance that can be used by a Vue app. */
export const createPrismic = (config: PrismicPluginConfig): PrismicPlugin => {
	return {
		...config,
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
	return inject(prismicKey, { componentsConfig: {} } as PrismicPlugin)
}

declare module "vue" {
	export interface ComponentCustomProperties {
		/** The Prismic Vue plugin interface. */
		$prismic: PrismicPlugin
	}
}
