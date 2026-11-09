<script setup lang="ts">
import { getTableComponentProps } from "@prismicio/vue"

defineProps(getTableComponentProps.th())
</script>

<template>
	<div class="header"><slot /></div>
</template>
