<script lang="ts" setup>
import type { ComponentOrTagName } from "../types"

defineProps<{
	/**
	 * An HTML tag name or a component used to wrap the output. Output is not
	 * wrapped by default.
	 *
	 * @defaultValue `"template"` (no wrapper)
	 */
	wrapper?: ComponentOrTagName
}>()
</script>

<template>
	<component v-if="wrapper" :is="wrapper" v-bind="$attrs">
		<slot />
	</component>
	<template v-else>
		<slot />
	</template>
</template>
