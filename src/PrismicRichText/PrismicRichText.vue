<script lang="ts" setup>
import {
	type LinkResolverFunction,
	type RichTextField,
} from "@prismicio/client"
import { asTree } from "@prismicio/client/richtext"
import type { PropType } from "vue"
import { computed } from "vue"

import type { ComponentOrTagName } from "../types"
import type { VueRichTextSerializer } from "./types"

import PrismicRichTextSerialize from "./PrismicRichTextSerialize.vue"

/**
 * Props for `<PrismicRichText />`.
 */
export type PrismicRichTextProps = {
	/**
	 * The Prismic rich text or title field to render.
	 */
	field: RichTextField | null | undefined

	/**
	 * An object that maps a rich text block type to a Vue component.
	 *
	 * @example
	 *
	 * ```javascript
	 * {
	 *   heading1: Heading1,
	 * }
	 * ```
	 */
	components?: VueRichTextSerializer

	/**
	 * A link resolver function used to resolve link when not using the route
	 * resolver parameter with `@prismicio/client`.
	 *
	 * @defaultValue The link resolver provided to `@prismicio/vue` plugin if configured.
	 *
	 * @see Link resolver documentation {@link https://prismic.io/docs/core-concepts/link-resolver-route-resolver#link-resolver}
	 */
	linkResolver?: LinkResolverFunction

	/**
	 * The Vue component rendered for links when the URL is internal.
	 *
	 * @defaultValue `<RouterLink>`
	 */
	internalLinkComponent?: ComponentOrTagName

	/**
	 * The Vue component rendered for links when the URL is external.
	 *
	 * @defaultValue `<a>`
	 */
	externalLinkComponent?: ComponentOrTagName

	/**
	 * The value to be rendered when the field is empty. If a fallback is not
	 * given, `null` (nothing) will be rendered.
	 */
	fallback?: ComponentOrTagName
}

// We're forced to declare props using the JavaScript syntax because `@vue/compiler-sfc`
// has limitations for inferring types from complex objects.
const props = defineProps({
	field: {
		type: Array as unknown as PropType<PrismicRichTextProps["field"]>,
	},
	components: {
		type: Object as PropType<PrismicRichTextProps["components"]>,
	},
	linkResolver: {
		type: Function as PropType<PrismicRichTextProps["linkResolver"]>,
	},
	internalLinkComponent: {
		type: [String, Object, Function] as PropType<
			PrismicRichTextProps["internalLinkComponent"]
		>,
	},
	externalLinkComponent: {
		type: [String, Object, Function] as PropType<
			PrismicRichTextProps["externalLinkComponent"]
		>,
	},
	fallback: {
		type: [String, Object, Function] as PropType<
			PrismicRichTextProps["fallback"]
		>,
	},
})
defineOptions({ name: "PrismicRichText" })

const children = computed(() => {
	return asTree(props.field || []).children
})
</script>

<template>
	<PrismicRichTextSerialize
		v-if="children.length"
		:children="children"
		:components="components"
		:link-resolver="linkResolver"
		:internal-link-component="internalLinkComponent"
		:external-link-component="externalLinkComponent"
	/>
	<component v-else-if="fallback" :is="fallback" />
</template>
