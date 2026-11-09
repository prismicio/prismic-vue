<script setup lang="ts">
import { getTableComponentProps } from "@prismicio/vue"

defineProps(getTableComponentProps.thead())
</script>

<template>
	<div class="head"><slot /></div>
</template>
