<script setup lang="ts">
import { onErrorCaptured, ref } from "vue"

// Shows errors from loading a page's content, so failing tests show why.
const error = ref<string>()
onErrorCaptured((err) => {
	error.value = err instanceof Error ? err.stack || err.message : String(err)
})
</script>

<template>
	<pre v-if="error" data-testid="page-error">{{ error }}</pre>
	<RouterView v-slot="{ Component }">
		<Suspense>
			<component :is="Component" />
		</Suspense>
	</RouterView>
</template>
