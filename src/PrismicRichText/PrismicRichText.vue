<script lang="ts" setup>
import type {
	LinkResolverFunction,
	RichTextField,
	RichTextNodeType,
} from "@prismicio/client"
import { asTree } from "@prismicio/client/richtext"
import type { PropType } from "vue"
import { computed } from "vue"

import { type ComponentOrTagName, isVueComponent } from "../types"
import type {
	InternalVueRichTextComponent,
	VueRichTextSerializer,
	VueShorthand,
} from "./types"

import PrismicRichTextDefaultComponent from "./PrismicRichTextDefaultComponent.vue"
import PrismicRichTextSerialize from "./PrismicRichTextSerialize.vue"

/**
 * Props for `<PrismicRichText />`.
 */
export type PrismicRichTextProps = {
	/** The Prismic rich text field to render. */
	field: RichTextField | null | undefined

	/**
	 * The link resolver used to resolve links.
	 *
	 * @remarks
	 * If your app uses route resolvers when querying for your Prismic
	 * repository's content, a link resolver does not need to be provided.
	 *
	 * @see Learn about link resolvers and route resolvers {@link https://prismic.io/docs/routes}
	 */
	linkResolver?: LinkResolverFunction

	/**
	 * An object that maps a rich text block type to a Vue component or a shorthand definition.
	 *
	 * @example
	 *
	 * ```javascript
	 * {
	 *   heading1: Heading1,
	 *   paragraph: { class: 'prose'},
	 *   strong: { as: 'em', class: 'font-bold' },
	 * }
	 * ```
	 */
	components?: VueRichTextSerializer

	/**
	 * The value to be rendered when the field is empty. If a fallback is not
	 * given, `null` will be rendered.
	 */
	fallback?: ComponentOrTagName
}

// We're forced to declare props using the JavaScript syntax because `@vue/compiler-sfc`
// has limitations for inferring types from complex objects.
const props = defineProps({
	field: {
		type: Array as unknown as PropType<PrismicRichTextProps["field"]>,
	},
	linkResolver: {
		type: Function as PropType<PrismicRichTextProps["linkResolver"]>,
	},
	components: {
		type: Object as PropType<PrismicRichTextProps["components"]>,
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

function getInternalComponent(type: keyof typeof RichTextNodeType) {
	const maybeComponentOrShorthand = props.components?.[type]

	if (isVueComponent(maybeComponentOrShorthand)) {
		return { is: maybeComponentOrShorthand }
	}

	return {
		is: PrismicRichTextDefaultComponent,
		props: {
			linkResolver: props.linkResolver,
			shorthand: maybeComponentOrShorthand as VueShorthand,
		},
	}
}

const internalComponents = computed<InternalVueRichTextComponent>(() => {
	return {
		heading1: getInternalComponent("heading1"),
		heading2: getInternalComponent("heading2"),
		heading3: getInternalComponent("heading3"),
		heading4: getInternalComponent("heading4"),
		heading5: getInternalComponent("heading5"),
		heading6: getInternalComponent("heading6"),
		paragraph: getInternalComponent("paragraph"),
		preformatted: getInternalComponent("preformatted"),
		strong: getInternalComponent("strong"),
		em: getInternalComponent("em"),
		"list-item": getInternalComponent("listItem"),
		"o-list-item": getInternalComponent("oListItem"),
		"group-list-item": getInternalComponent("list"),
		"group-o-list-item": getInternalComponent("oList"),
		image: getInternalComponent("image"),
		embed: getInternalComponent("embed"),
		hyperlink: getInternalComponent("hyperlink"),
		label: getInternalComponent("label"),
		span: getInternalComponent("span"),
	}
})
</script>

<template>
	<PrismicRichTextSerialize
		v-if="children.length"
		:children="children"
		:internal-components="internalComponents"
	/>
	<component v-else-if="fallback" :is="fallback" />
</template>
