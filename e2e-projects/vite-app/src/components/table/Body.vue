<script setup lang="ts">
import { getTableComponentProps } from "@prismicio/vue"

defineProps(getTableComponentProps.tbody())
</script>

<template>
	<div class="body"><slot /></div>
</template>
