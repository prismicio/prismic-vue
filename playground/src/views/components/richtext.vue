<template>
	<div class="componentsRichText">
		<input v-model="inputText" type="text" />{{ inputText }}
		<prismic-rich-text :field="null" />
		<prismic-rich-text :field="empty" />
		<prismic-rich-text :field="single" />
		<prismic-rich-text :field="multi" />
		<prismic-rich-text :field="computed" />
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue"

import { empty, multi, single } from "../../mocks/richtext"

export default defineComponent({
	name: "ComponentsRichText",
	data() {
		return {
			empty,
			single,
			multi,
			inputText: "",
		}
	},
	computed: {
		computed() {
			return [
				this.multi[0],
				{ ...this.multi[1], text: `${this.multi[1].text}${this.inputText}` },
				...this.multi.slice(2),
			]
		},
	},
})
</script>
