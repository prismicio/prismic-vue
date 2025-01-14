<template>
	<div class="componentsImage">
		<input v-model="inputText" type="text" />{{ inputText }}<br />
		<prismic-image :field="null" />
		<prismic-image :field="empty" />
		<prismic-image :field="simple" />
		<prismic-image :field="simple" :imgix-params="{ sat: 100 }" />
		<prismic-image :field="simple" :widths="[100, 200]" />
		<prismic-image
			:field="simple"
			:imgix-params="{ sat: 100 }"
			widths="defaults"
		/>
		<prismic-image :field="simple" widths="thumbnails" />
		<prismic-image
			:field="simple"
			:imgix-params="{ sat: 100 }"
			:pixel-densities="[1, 2]"
		/>
		<prismic-image :field="simple" pixel-densities="defaults" />
		<prismic-image
			:field="simple"
			:imgix-params="{ sat: 100 }"
			widths="defaults"
			pixel-densities="defaults"
		/>
		<prismic-image :field="simple.twitter_variant" />
		<prismic-image :field="computed" />
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue"

import { empty, simple } from "../../mocks/image"

export default defineComponent({
	name: "ComponentsImage",
	data() {
		return {
			empty,
			simple,
			inputText: "",
		}
	},
	computed: {
		computed() {
			return {
				...this.simple,
				alt: this.inputText,
			}
		},
	},
})
</script>
