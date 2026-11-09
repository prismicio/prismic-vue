<script setup lang="ts">
import { getRichTextComponentProps } from "@prismicio/vue"

defineProps(getRichTextComponentProps("strong"))
</script>

<template>
	<span class="strong"><slot /></span>
</template>
