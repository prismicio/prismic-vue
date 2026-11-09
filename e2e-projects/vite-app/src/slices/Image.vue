<script setup lang="ts">
import { getSliceComponentProps } from "@prismicio/vue"

defineProps(getSliceComponentProps())
</script>

<template>
	<div data-testid="image">{{ JSON.stringify($props) }}</div>
</template>
