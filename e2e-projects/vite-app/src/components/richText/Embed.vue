<script setup lang="ts">
import { getRichTextComponentProps } from "@prismicio/vue"

defineProps(getRichTextComponentProps("embed"))
</script>

<template>
	<div data-bar="true" :data-html="node.oembed.html" />
</template>
