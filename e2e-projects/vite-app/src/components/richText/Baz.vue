<script setup lang="ts">
import { getRichTextComponentProps } from "@prismicio/vue"

defineProps(getRichTextComponentProps())
</script>

<template>
	<div data-baz="true"><slot /></div>
</template>
