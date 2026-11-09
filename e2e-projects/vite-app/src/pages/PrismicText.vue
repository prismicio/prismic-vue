<script setup lang="ts">
import { type RichTextField, isFilled } from "@prismicio/client"
import { PrismicText, usePrismic } from "@prismicio/vue"
import { ref } from "vue"

import ErrorBoundary from "../components/ErrorBoundary.vue"

const { client } = usePrismic()
const { data: tests } = await client.getSingle("rich_text_test")

if (!isFilled.richText(tests.filled)) throw new Error("Expected a filled rich text field.")
if (isFilled.richText(tests.empty)) throw new Error("Expected an empty rich text field.")

const reactive = ref<RichTextField>(tests.filled)
</script>

<template>
	<div data-testid="filled"><PrismicText :field="tests.filled" /></div>
	<div data-testid="empty"><PrismicText :field="tests.empty" /></div>
	<div data-testid="fallback"><PrismicText :field="tests.empty" fallback="foo" /></div>
	<div data-testid="fallback-null"><PrismicText :field="null" fallback="foo" /></div>
	<div data-testid="fallback-undefined"><PrismicText :field="undefined" fallback="foo" /></div>
	<div data-testid="separator"><PrismicText :field="tests.filled" separator="x" /></div>

	<div data-testid="keytext">
		<ErrorBoundary><PrismicText :field="tests.keytext" /></ErrorBoundary>
	</div>

	<button @click="reactive = tests.heading1">Change field</button>
	<div data-testid="reactive"><PrismicText :field="reactive" /></div>
</template>
