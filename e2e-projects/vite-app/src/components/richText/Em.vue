<script setup lang="ts">
import { getRichTextComponentProps } from "@prismicio/vue"

defineProps(getRichTextComponentProps("em"))
</script>

<template>
	<span class="em"><slot /></span>
</template>
