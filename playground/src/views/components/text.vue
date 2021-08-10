<template>
	<div class="componentsText">
		<input v-model="inputText" type="text" />{{ inputText }}
		<prismic-text :field="null" />
		<prismic-text :field="empty" />
		<prismic-text :field="single" />
		<prismic-text :field="multi" />
		<prismic-text :field="computed" wrapper="h1" />
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { empty, single, multi } from "../../mocks/richtext.json";

export default defineComponent({
	name: "ComponentsText",
	data() {
		return {
			empty,
			single,
			multi,
			inputText: "",
		};
	},
	computed: {
		computed() {
			return [{ ...this.single[0], text: this.inputText }];
		},
	},
});
</script>
