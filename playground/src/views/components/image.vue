<template>
	<div class="componentsImage">
		<input v-model="inputText" type="text" />{{ inputText }}
		<prismic-image :field="null" />
		<prismic-image :field="empty" />
		<prismic-image :field="simple" />
		<prismic-image :field="simple.twitter_variant" />
		<prismic-image :field="computed" />
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { empty, simple } from "../../mocks/image.json";

export default defineComponent({
	name: "ComponentsImage",
	data() {
		return {
			empty,
			simple,
			inputText: "",
		};
	},
	computed: {
		computed() {
			return {
				...this.simple,
				alt: this.inputText,
			};
		},
	},
});
</script>
