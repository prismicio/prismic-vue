<script setup lang="ts">
import { getTableComponentProps } from "@prismicio/vue"

defineProps(getTableComponentProps.tr())
</script>

<template>
	<div class="row"><slot /></div>
</template>
