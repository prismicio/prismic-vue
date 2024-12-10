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
	<Component v-if="wrapper" :is="wrapper" v-bind="$attrs">
		<slot />
	</Component>
	<template v-else>
		<slot />
	</template>
</template>
