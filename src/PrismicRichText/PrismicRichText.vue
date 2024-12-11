<script lang="ts" setup>
import {
	type HTMLRichTextFunctionSerializer,
	type HTMLRichTextMapSerializer,
	type LinkResolverFunction,
	type RichTextField,
	isFilled,
} from "@prismicio/client"
import { asTree } from "@prismicio/client/richtext"
import { DEV } from "esm-env"
import { computed, watchEffect } from "vue"

import Wrapper from "../lib/Wrapper.vue"

import type { ComponentOrTagName } from "../types"
import type { VueRichTextSerializer } from "./types"

import { usePrismic } from "../usePrismic"

import DeprecatedPrismicRichText from "./DeprecatedPrismicRichText.vue"
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
	 * The value to be rendered when the field is empty. If a fallback is not
	 * given, `null` (nothing) will be rendered.
	 */
	fallback?: ComponentOrTagName

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
	 * An HTML serializer to customize the way rich text fields are rendered.
	 *
	 * @deprecated Use `components` instead.
	 *
	 * @defaultValue The HTML serializer provided to `@prismicio/vue` plugin if configured.
	 *
	 * @see HTML serializer documentation {@link https://prismic.io/docs/core-concepts/html-serializer}
	 */
	// TODO: Remove in v6
	serializer?: HTMLRichTextFunctionSerializer | HTMLRichTextMapSerializer

	/**
	 * An HTML tag name or a component used to wrap the output. `<PrismicText />`
	 * is not wrapped by default.
	 *
	 * @defaultValue `"template"` (no wrapper)
	 */
	wrapper?: ComponentOrTagName
}

const props = defineProps<PrismicRichTextProps>()
defineOptions({ name: "PrismicRichText" })

const { options } = usePrismic()

const resolvedComponents = computed(() => {
	return props.components || options.components?.richTextComponents
})

const resolvedLinkResolver = computed(() => {
	return props.linkResolver || options.linkResolver
})

const children = computed(() => {
	return asTree(props.field || []).children
})

const isModern = computed(() => {
	// Explicit components prop
	if (props.components) {
		return true
	}

	// Explicit serializer prop
	if (props.serializer) {
		return false
	}

	// Global components option
	if (options.components?.richTextComponents) {
		return true
	}

	// Global serializer option
	if (options.richTextSerializer) {
		return false
	}

	// Default to modern
	return true
})

if (DEV) {
	watchEffect(() => {
		// TODO: Remove in v6
		if (props.components && props.serializer) {
			console.warn(
				`[PrismicRichText] Only one of "components" or "serializer" (deprecated) props can be provided. You can resolve this warning by removing either the "components" or "serializer" prop. "components" will be used in this case.`,
			)
		}
	})
}
</script>

<template>
	<Wrapper
		v-if="isModern && (isFilled.richText(field) || fallback)"
		:wrapper="wrapper"
	>
		<PrismicRichTextSerialize
			v-if="children.length"
			:children="children"
			:components="resolvedComponents"
			:link-resolver="resolvedLinkResolver"
		/>
		<component v-else :is="fallback" />
	</Wrapper>
	<DeprecatedPrismicRichText
		v-else-if="!isModern"
		:field="field"
		:fallback="typeof fallback === 'string' ? fallback : undefined"
		:link-resolver="linkResolver"
		:serializer="serializer"
		:wrapper="wrapper"
	/>
</template>
