<script lang="ts" setup>
import type { EmbedField } from "@prismicio/client"
import { isFilled } from "@prismicio/client"

import type { ComponentOrTagName } from "./types"

/**
 * The default component rendered to wrap the embed.
 */
const defaultWrapper = "div"

/**
 * Props for `<PrismicEmbed />`.
 */
export type PrismicEmbedProps = {
	/**
	 * The Prismic EMbed field to render.
	 */
	field: EmbedField

	/**
	 * An HTML tag name or a component used to wrap the output.
	 *
	 * @defaultValue `"div"`
	 */
	wrapper?: ComponentOrTagName
}

defineProps<PrismicEmbedProps>()
defineOptions({ name: "PrismicEmbed" })
</script>

<template>
	<component
		v-if="isFilled.embed(field)"
		:is="wrapper || defaultWrapper"
		:data-oembed="field.embed_url"
		:data-oembed-type="field.type"
		:data-oembed-provider="field.provider_name"
		v-html="field.html"
	/>
</template>
