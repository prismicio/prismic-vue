<script lang="ts" setup>
import type { LinkResolverFunction } from "@prismicio/client"
import type { asTree } from "@prismicio/client/richtext"

import type { ComponentOrTagName } from "../types"
import type { VueRichTextSerializer, VueShorthand } from "./types"

import PrismicRichTextDefaultComponent from "./PrismicRichTextDefaultComponent.vue"

const CHILD_TYPE_RENAMES = {
	"list-item": "listItem",
	"o-list-item": "oListItem",
	"group-list-item": "list",
	"group-o-list-item": "oList",
} as const

type PrismicRichTextSerializeProps = {
	components?: VueRichTextSerializer
	children: ReturnType<typeof asTree>["children"]
	linkResolver?: LinkResolverFunction
	internalLinkComponent?: ComponentOrTagName
	externalLinkComponent?: ComponentOrTagName
}

const props = defineProps<PrismicRichTextSerializeProps>()
defineOptions({ name: "PrismicRichTextSerialize" })

function getComponent(child: ReturnType<typeof asTree>["children"][number]) {
	const maybeComponentOrShorthand =
		props.components?.[
			CHILD_TYPE_RENAMES[child.type as keyof typeof CHILD_TYPE_RENAMES] ||
				(child.type as keyof typeof props.components)
		]

	if (
		typeof maybeComponentOrShorthand === "function" ||
		(typeof maybeComponentOrShorthand === "object" &&
			(typeof maybeComponentOrShorthand.render === "function" ||
				typeof maybeComponentOrShorthand.setup === "function" ||
				!!maybeComponentOrShorthand.__file ||
				!!maybeComponentOrShorthand.__name))
	) {
		return { is: maybeComponentOrShorthand }
	}

	return {
		is: PrismicRichTextDefaultComponent,
		props: {
			linkResolver: props.linkResolver,
			internalLinkComponent: props.internalLinkComponent,
			externalLinkComponent: props.externalLinkComponent,
			shorthand: maybeComponentOrShorthand,
		},
	}
}
</script>

<template>
	<component
		v-for="child in props.children"
		:key="JSON.stringify(child)"
		:is="getComponent(child).is"
		:node="child.node"
		v-bind="getComponent(child).props"
		><PrismicRichTextSerialize
			v-if="child.children.length"
			:children="child.children"
			:components="components"
			:link-resolver="linkResolver"
			:internal-link-component="internalLinkComponent"
			:external-link-component="externalLinkComponent"
	/></component>
</template>
