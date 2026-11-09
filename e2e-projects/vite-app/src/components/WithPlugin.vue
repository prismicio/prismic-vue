<script setup lang="ts">
// Renders a component in its own app, so it can use a different plugin configuration.
import { type PrismicPluginConfig, createPrismic, usePrismic } from "@prismicio/vue"
import { type Component, createApp, onBeforeUnmount, onMounted, useTemplateRef } from "vue"

import { router } from "../router"

const props = defineProps<{
	config: Omit<PrismicPluginConfig, "client">
	component: Component
}>()

const { client } = usePrismic()
const app = createApp(props.component)
	.use(router)
	.use(createPrismic({ client, ...props.config }))
const el = useTemplateRef<HTMLElement>("el")

onMounted(() => app.mount(el.value!))
onBeforeUnmount(() => app.unmount())
</script>

<template>
	<div ref="el" />
</template>
