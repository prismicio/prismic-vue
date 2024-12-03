<template>
	<div class="domComposition">
		<ul>
			<li>
				{{ resolvedSimple }}
			</li>
			<li>
				{{ resolvedBlank }}
			</li>
			<li>
				{{ resolvedInternal }}
			</li>
		</ul>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue"

import { blank, internal, simple } from "../../mocks/link.json"

export default defineComponent({
	data() {
		return {
			resolvedSimple: "" as string | null,
			resolvedBlank: "" as string | null,
			resolvedInternal: "" as string | null,
		}
	},
	created(): void {
		this.resolvedSimple = this.$prismic.asLink(simple)
		this.resolvedBlank = this.$prismic.asLink(blank)
		this.resolvedInternal = this.$prismic.asLink(internal)
	},
})
</script>
