<template>
	<div class="componentsText">
		<input v-model="inputText" type="text" />{{ inputText }}
		<prismic-text :field="null" />
		<prismic-text :field="empty" />
		<prismic-text :field="single" />
		<prismic-text :field="multi" />
		<prismic-text :field="single" wrapper="h1" />
		<prismic-text :field="single" :wrapper="WrapperComponent" />
		<prismic-text :field="computed" />
	</div>
</template>

<script lang="ts">
import { defineComponent, markRaw } from "vue";

import { WrapperComponent } from "../../components/WrapperComponent";
import { empty, multi, single } from "../../mocks/richtext.json";

export default defineComponent({
	name: "ComponentsText",
	data() {
		return {
			empty,
			single,
			multi,
			inputText: "",
			WrapperComponent: markRaw(WrapperComponent),
		};
	},
	computed: {
		computed() {
			return [{ ...this.single[0], text: this.inputText }];
		},
	},
});
</script>
