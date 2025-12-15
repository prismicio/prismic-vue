<script lang="ts" setup>
import type { LinkResolverFunction } from "@prismicio/client"
import { computed } from "vue"

import type { ComponentOrTagName } from "../types"
import type { RichTextComponentProps, VueShorthand } from "./types"

import PrismicImage from "../PrismicImage.vue"
import PrismicLink from "../PrismicLink.vue"

const props = defineProps<
	RichTextComponentProps & {
		linkResolver?: LinkResolverFunction
		internalLinkComponent?: ComponentOrTagName
		externalLinkComponent?: ComponentOrTagName
		shorthand?: VueShorthand
	}
>()
defineOptions({ name: "PrismicRichTextDefaultComponent" })

const as = computed(() => {
	return props.node.type !== "image" && props.node.type !== "span" ? props.shorthand?.as : undefined
})

const attrs = computed(() => {
	return props.shorthand?.attrs ?? {}
})

const dir = computed(() => {
	return "direction" in props.node && props.node.direction === "rtl"
		? "rtl"
		: undefined
})
</script>

<template>
	<component v-if="as" :is="as" :dir="dir" v-bind="attrs"><slot /></component>
	<h1 v-else-if="node.type === 'heading1'" :dir="dir" v-bind="attrs"><slot /></h1>
	<h2 v-else-if="node.type === 'heading2'" :dir="dir" v-bind="attrs"><slot /></h2>
	<h3 v-else-if="node.type === 'heading3'" :dir="dir" v-bind="attrs"><slot /></h3>
	<h4 v-else-if="node.type === 'heading4'" :dir="dir" v-bind="attrs"><slot /></h4>
	<h5 v-else-if="node.type === 'heading5'" :dir="dir" v-bind="attrs"><slot /></h5>
	<h6 v-else-if="node.type === 'heading6'" :dir="dir" v-bind="attrs"><slot /></h6>
	<p v-else-if="node.type === 'paragraph'" :dir="dir" v-bind="attrs"><slot /></p>
	<pre v-else-if="node.type === 'preformatted'" v-bind="attrs"><slot /></pre>
	<strong v-else-if="node.type === 'strong'" v-bind="attrs"><slot /></strong>
	<em v-else-if="node.type === 'em'" v-bind="attrs"><slot /></em>
	<li v-else-if="node.type === 'list-item'" :dir="dir" v-bind="attrs"><slot /></li>
	<li v-else-if="node.type === 'o-list-item'" :dir="dir" v-bind="attrs"><slot /></li>
	<ul v-else-if="node.type === 'group-list-item'" v-bind="attrs">
		<slot />
	</ul>
	<ol v-else-if="node.type === 'group-o-list-item'" v-bind="attrs">
		<slot />
	</ol>
	<p class="block-img" v-else-if="node.type === 'image'">
		<PrismicLink
			v-if="node.linkTo"
			:field="node.linkTo"
			:internal-component="internalLinkComponent"
			:external-component="externalLinkComponent"
			><PrismicImage :field="node"
		/></PrismicLink>
		<PrismicImage v-else :field="node" v-bind="attrs" />
	</p>
	<div
		v-else-if="node.type === 'embed'"
		:data-oembed="node.oembed.embed_url"
		:data-oembed-type="node.oembed.type"
		:data-oembed-provider="node.oembed.provider_name"
		v-html="node.oembed.html"
		v-bind="attrs"
	/>
	<PrismicLink
		v-else-if="node.type === 'hyperlink'"
		:field="node.data"
		:link-resolver="linkResolver"
		:internal-component="internalLinkComponent"
		:external-component="externalLinkComponent"
		v-bind="attrs"
		><slot
	/></PrismicLink>
	<span v-else-if="node.type === 'label'" :class="node.data.label" v-bind="attrs"
		><slot
	/></span>
	<template v-else v-for="(line, index) in node.text.split('\n')" :key="line"
		><br v-if="index > 0" />{{ line }}</template
	>
</template>
