<script setup lang="ts">
// mapSliceZone() replaces the slice props with the mapper's return value.
defineOptions({ inheritAttrs: false })
</script>

<template>
	<div data-testid="text">{{ JSON.stringify($attrs) }}</div>
</template>
