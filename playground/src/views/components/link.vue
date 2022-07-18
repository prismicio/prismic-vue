<template>
	<div class="componentsLink">
		<input v-model="inputText" type="text" />{{ inputText }}
		<ul>
			<li>
				<prismic-link :field="null"> null </prismic-link>
			</li>
			<li>
				<prismic-link :field="empty"> any </prismic-link>
			</li>
			<li>
				<prismic-link :field="simple"> simple </prismic-link>
			</li>
			<li>
				<prismic-link :field="simple" v-slot="{ href }">
					{{ href }}
				</prismic-link>
			</li>
			<li>
				<prismic-link :field="blank"> blank </prismic-link>
			</li>
			<li>
				<prismic-link :field="internal"> internal </prismic-link>
			</li>
			<li>
				<prismic-link v-slot="{ href }" :field="internal">
					{{ href }}
				</prismic-link>
			</li>
			<li>
				<prismic-link :field="simple" :external-component="WrapperComponent">
					simple
				</prismic-link>
			</li>
			<li>
				<prismic-link :field="internal" :internal-component="WrapperComponent">
					simple
				</prismic-link>
			</li>
			<li>
				<prismic-link :field="computed"> computed </prismic-link>
			</li>
		</ul>
	</div>
</template>

<script lang="ts">
import { defineComponent, markRaw } from "vue";

import { WrapperComponent } from "../../components/WrapperComponent";

import { empty, simple, blank, internal } from "../../mocks/link.json";

export default defineComponent({
	name: "ComponentsLink",
	data() {
		return {
			empty,
			simple,
			blank,
			internal,
			inputText: "",
			WrapperComponent: markRaw(WrapperComponent),
		};
	},
	computed: {
		computed() {
			return {
				...this.simple,
				url: this.inputText,
			};
		},
	},
});
</script>
