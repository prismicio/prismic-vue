<script setup lang="ts">
import { getSliceComponentProps } from "@prismicio/vue"

defineProps(getSliceComponentProps())
</script>

<template>
	<div data-testid="global">{{ slice.slice_type }}</div>
</template>
