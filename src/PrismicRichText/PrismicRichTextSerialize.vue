<script lang="ts" setup>
import type { asTree } from "@prismicio/client/richtext"

import type { InternalVueRichTextComponent } from "./types"

type PrismicRichTextSerializeProps = {
	children: ReturnType<typeof asTree>["children"]
	internalComponents: InternalVueRichTextComponent
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
		v-bind="internalComponents[child.type].props"
		><PrismicRichTextSerialize
			v-if="child.children.length"
			:children="child.children"
			:internal-components="internalComponents"
	/></component>
</template>
