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
				<prismic-link :field="text" />
			</li>
			<li>
				<prismic-link :field="textBlank" />
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
				<prismic-link
					:field="internalText"
					:internal-component="WrapperComponent"
				/>
			</li>
			<li>
				<prismic-link :field="computed"> computed </prismic-link>
			</li>
		</ul>
	</div>
</template>

<script lang="ts">
import { defineComponent, markRaw } from "vue"

import { WrapperComponent } from "../../components/WrapperComponent"
import {
	blank,
	empty,
	internal,
	internalText,
	simple,
	text,
	textBlank,
} from "../../mocks/link"

export default defineComponent({
	name: "ComponentsLink",
	data() {
		return {
			empty,
			simple,
			blank,
			internal,
			internalText,
			text,
			textBlank,
			inputText: "",
			WrapperComponent: markRaw(WrapperComponent),
		}
	},
	computed: {
		computed() {
			return {
				...this.simple,
				url: this.inputText,
			}
		},
	},
})
</script>
