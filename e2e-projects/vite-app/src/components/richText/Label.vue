<script setup lang="ts">
import { getRichTextComponentProps } from "@prismicio/vue"

defineProps(getRichTextComponentProps("label"))
</script>

<template>
	<span data-bar="true" :data-label="node.data.label"><slot /></span>
</template>
