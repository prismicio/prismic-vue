<script setup lang="ts">
import { getRichTextComponentProps } from "@prismicio/vue"

defineProps(getRichTextComponentProps("paragraph"))
</script>

<template>
	<p class="paragraph"><slot /></p>
</template>
