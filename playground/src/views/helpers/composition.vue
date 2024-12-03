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

import { usePrismic } from "../../../../src"

export default defineComponent({
	setup(): {
		resolvedSimple: string | null
		resolvedBlank: string | null
		resolvedInternal: string | null
	} {
		const prismic = usePrismic()

		return {
			resolvedSimple: prismic.asLink(simple),
			resolvedBlank: prismic.asLink(blank),
			resolvedInternal: prismic.asLink(internal),
		}
	},
})
</script>
