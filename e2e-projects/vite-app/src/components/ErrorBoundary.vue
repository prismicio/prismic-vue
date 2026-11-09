<script setup lang="ts">
import { onErrorCaptured, ref } from "vue"

const error = ref<string>()

onErrorCaptured((err) => {
	error.value ??= err instanceof Error ? err.message : String(err)

	return false
})
</script>

<template>
	<p v-if="error" data-testid="error">{{ error }}</p>
	<slot v-else />
</template>
