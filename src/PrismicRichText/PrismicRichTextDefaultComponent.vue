<script lang="ts" setup>
import type { LinkResolverFunction } from "@prismicio/client"
import { computed } from "vue"

import type { RichTextComponentProps } from "./types"

import PrismicEmbed from "../PrismicEmbed.vue"
import PrismicImage from "../PrismicImage.vue"
import PrismicLink from "../PrismicLink.vue"

const props = defineProps<
	RichTextComponentProps & {
		linkResolver?: LinkResolverFunction
	}
>()
defineOptions({ name: "PrismicRichTextDefaultComponent" })

const dir = computed(() => {
	return "direction" in props.node && props.node.direction === "rtl"
		? "rtl"
		: undefined
})
</script>

<template>
	<h1 v-if="node.type === 'heading1'" :dir="dir"><slot /></h1>
	<h2 v-else-if="node.type === 'heading2'" :dir="dir"><slot /></h2>
	<h3 v-else-if="node.type === 'heading3'" :dir="dir"><slot /></h3>
	<h4 v-else-if="node.type === 'heading4'" :dir="dir"><slot /></h4>
	<h5 v-else-if="node.type === 'heading5'" :dir="dir"><slot /></h5>
	<h6 v-else-if="node.type === 'heading6'" :dir="dir"><slot /></h6>
	<p v-else-if="node.type === 'paragraph'" :dir="dir"><slot /></p>
	<pre v-else-if="node.type === 'preformatted'"><slot /></pre>
	<strong v-else-if="node.type === 'strong'"><slot /></strong>
	<em v-else-if="node.type === 'em'"><slot /></em>
	<li v-else-if="node.type === 'list-item'" :dir="dir"><slot /></li>
	<li v-else-if="node.type === 'o-list-item'" :dir="dir"><slot /></li>
	<ul v-else-if="node.type === 'group-list-item'">
		<slot />
	</ul>
	<ol v-else-if="node.type === 'group-o-list-item'">
		<slot />
	</ol>
	<p class="block-img" v-else-if="node.type === 'image'">
		<PrismicLink v-if="node.linkTo" :field="node.linkTo"
			><PrismicImage :field="node"
		/></PrismicLink>
		<PrismicImage v-else :field="node" />
	</p>
	<PrismicEmbed v-else-if="node.type === 'embed'" :field="node.oembed" />
	<PrismicLink
		v-else-if="node.type === 'hyperlink'"
		:field="node.data"
		:link-resolver="linkResolver"
		><slot
	/></PrismicLink>
	<span v-else-if="node.type === 'label'" :class="node.data.label"
		><slot
	/></span>
	<template v-else v-for="(line, index) in node.text.split('\n')" :key="line"
		><br v-if="index > 0" />{{ line }}</template
	>
</template>
