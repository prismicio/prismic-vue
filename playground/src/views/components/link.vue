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
				<prismic-link :field="computed"> computed </prismic-link>
			</li>
		</ul>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

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
