<script lang="ts" setup>
import type { LinkResolverFunction } from "@prismicio/client"
import type { asTree } from "@prismicio/client/richtext"

import type { VueRichTextSerializer } from "./types"

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
}

const props = defineProps<PrismicRichTextSerializeProps>()
defineOptions({ name: "PrismicRichTextSerialize" })

function getComponent(child: ReturnType<typeof asTree>["children"][number]) {
	return (
		props.components?.[
			CHILD_TYPE_RENAMES[child.type as keyof typeof CHILD_TYPE_RENAMES] ||
				(child.type as keyof typeof props.components)
		] || PrismicRichTextDefaultComponent
	)
}
</script>

<template>
	<component
		v-for="child in props.children"
		:key="JSON.stringify(child)"
		:is="getComponent(child)"
		:node="child.node"
		:link-resolver="
			getComponent(child) === PrismicRichTextDefaultComponent
				? props.linkResolver
				: undefined
		"
		><PrismicRichTextSerialize
			v-if="child.children.length"
			:children="child.children"
			:components="components"
			:link-resolver="linkResolver"
	/></component>
</template>
