<script setup lang="ts">
import { getTableComponentProps } from "@prismicio/vue"

defineProps(getTableComponentProps.table())
</script>

<template>
	<div class="table"><slot /></div>
</template>
