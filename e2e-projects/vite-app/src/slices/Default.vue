<script setup lang="ts">
import { getSliceComponentProps } from "@prismicio/vue"

defineProps(getSliceComponentProps())
</script>

<template>
	<div data-testid="default">{{ JSON.stringify($props) }}</div>
</template>
