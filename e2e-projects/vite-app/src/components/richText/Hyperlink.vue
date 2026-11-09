<script setup lang="ts">
import { getRichTextComponentProps } from "@prismicio/vue"

defineProps(getRichTextComponentProps("hyperlink"))
</script>

<template>
	<span data-bar="true" :data-url="node.data.url"><slot /></span>
</template>
