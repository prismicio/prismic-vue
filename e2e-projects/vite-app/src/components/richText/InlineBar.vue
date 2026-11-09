<script setup lang="ts">
import { getRichTextComponentProps } from "@prismicio/vue"

defineProps(getRichTextComponentProps())
</script>

<template>
	<span data-bar="true"><slot /></span>
</template>
