<script lang="ts" setup>
import type { AsLinkAttrsConfig } from "@prismicio/client"
import {
	type LinkField,
	type LinkResolverFunction,
	type PrismicDocument,
	asLinkAttrs,
} from "@prismicio/client"
import { computed } from "vue"

import { isInternalURL } from "./lib/isInternalURL"

import type { ComponentOrTagName } from "./types"

import { usePrismic } from "./usePrismic"

/**
 * The default component rendered for internal URLs.
 */
const defaultInternalComponent = "router-link"

/**
 * The default component rendered for external URLs.
 */
const defaultExternalComponent = "a"

/**
 * The default rel attribute rendered for external URLs.
 */
const defaultExternalRelAttribute = "noreferrer"

/**
 * Props for `<PrismicLink />`.
 */
export type PrismicLinkProps = {
	/**
	 * A link resolver function used to resolve links when not using the route
	 * resolver parameter with `@prismicio/client`.
	 *
	 * @defaultValue The link resolver provided to `@prismicio/vue` plugin if configured.
	 *
	 * @see Link resolver documentation {@link https://prismic.io/docs/core-concepts/link-resolver-route-resolver#link-resolver}
	 */
	linkResolver?: LinkResolverFunction

	/**
	 * The `rel` attribute for the link. By default, `"noreferrer"` is provided if
	 * the link's URL is external. This prop can be provided a function to use the
	 * link's metadata to determine the `rel` value.
	 *
	 * @defaultValue The one provided to `@prismicio/vue` plugin if configured.
	 */
	rel?: string | AsLinkAttrsConfig["rel"]

	/**
	 * An HTML tag name or a component used to render internal links.
	 *
	 * @remarks
	 * HTML tag names will be rendered using the anchor tag interface (`href`,
	 * `target`, and `rel` attributes).
	 * @remarks
	 * Components will be rendered using Vue Router {@link RouterLink} interface
	 * (`to` props).
	 *
	 * @defaultValue The one provided to `@prismicio/vue` plugin if configured, {@link RouterLink} otherwise.
	 */
	internalComponent?: ComponentOrTagName

	/**
	 * An HTML tag name or a component used to render external links.
	 *
	 * @remarks
	 * HTML tag names will be rendered using the anchor tag interface (`href`,
	 * `target`, and `rel` attributes).
	 * @remarks
	 * Components will be rendered using Vue Router {@link RouterLink} interface
	 * (`to` props).
	 *
	 * @defaultValue The one provided to `@prismicio/vue` plugin if configured, `"a"` otherwise.
	 */
	externalComponent?: ComponentOrTagName
} & (
	| {
			/**
			 * The Prismic link field to render.
			 */
			field: LinkField
			document?: never
	  }
	| {
			/**
			 * The Prismic document to render as a link.
			 */
			document: PrismicDocument
			field?: never
	  }
)

const props = defineProps<PrismicLinkProps>()
defineOptions({ name: "PrismicLink" })

const { options } = usePrismic()

const rawAttrs = computed(() => {
	return asLinkAttrs(props.field || props.document, {
		linkResolver: props.linkResolver || options.linkResolver,
		rel(args) {
			const maybeRel = props.rel || options.components?.linkRel
			if (maybeRel) {
				return typeof maybeRel === "function" ? maybeRel(args) : maybeRel
			}

			return args.isExternal ? defaultExternalRelAttribute : undefined
		},
	})
})

const component = computed(() => {
	return isInternalURL(rawAttrs.value.href || "")
		? props.internalComponent ||
				options.components?.linkInternalComponent ||
				defaultInternalComponent
		: props.externalComponent ||
				options.components?.linkExternalComponent ||
				defaultExternalComponent
})

// Match Vue Router's `<RouterLink />` interface unless the component is an anchor tag.
const attrs = computed(() => {
	return component.value === "a"
		? {
				href: rawAttrs.value.href,
				target: rawAttrs.value.target,
				rel: rawAttrs.value.rel,
			}
		: {
				to: rawAttrs.value.href,
				target: rawAttrs.value.target,
				rel: rawAttrs.value.rel,
			}
})
</script>

<template>
	<component :is="component" v-bind="attrs">
		<slot>
			{{ props.field && "text" in props.field ? props.field.text : undefined }}
		</slot>
	</component>
</template>
