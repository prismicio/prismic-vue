<script setup lang="ts">
import { getRichTextComponentProps } from "@prismicio/vue"

defineProps(getRichTextComponentProps("image"))
</script>

<template>
	<div data-bar="true" :data-src="node.url" />
</template>
