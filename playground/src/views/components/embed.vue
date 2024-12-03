<template>
	<div class="componentsEmbed">
		<input v-model="inputText" type="text" />{{ inputText }}
		<prismic-embed :field="null" />
		<prismic-embed :field="empty" />
		<prismic-embed :field="youtube" />
		<prismic-embed :field="twitter" />
		<prismic-embed :field="computed" />
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue"

import { empty, twitter, youtube } from "../../mocks/embed.json"

export default defineComponent({
	name: "ComponentsEmbed",
	data() {
		return {
			empty,
			youtube,
			twitter,
			inputText: "",
		}
	},
	computed: {
		computed() {
			return {
				...this.youtube,
				html: `${this.youtube.html}<div>${this.inputText}</div>`,
			}
		},
	},
})
</script>
