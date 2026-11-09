<script setup lang="ts">
import { getTableComponentProps } from "@prismicio/vue"

defineProps(getTableComponentProps.td())
</script>

<template>
	<div class="data"><slot /></div>
</template>
