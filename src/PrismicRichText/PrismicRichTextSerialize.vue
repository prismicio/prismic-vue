<script lang="ts" setup>
import type { asTree } from "@prismicio/client/richtext"

import type { InternalRichTextComponents } from "./types"

type PrismicRichTextSerializeProps = {
	children: ReturnType<typeof asTree>["children"]
	internalComponents: InternalRichTextComponents
}

const props = defineProps<PrismicRichTextSerializeProps>()
defineOptions({ name: "PrismicRichTextSerialize" })
</script>

<template>
	<component
		v-for="child in props.children"
		:key="JSON.stringify(child)"
		:is="internalComponents[child.type].is"
		:node="child.node"
		:link-resolver="internalComponents[child.type].linkResolver"
		:shorthand="internalComponents[child.type].shorthand"
		><PrismicRichTextSerialize
			v-if="child.children.length"
			:children="child.children"
			:internal-components="internalComponents"
	/></component>
</template>
