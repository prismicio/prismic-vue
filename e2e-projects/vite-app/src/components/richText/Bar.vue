<script setup lang="ts">
import { getRichTextComponentProps } from "@prismicio/vue"

defineProps(getRichTextComponentProps())
</script>

<template>
	<div data-bar="true"><slot /></div>
</template>
