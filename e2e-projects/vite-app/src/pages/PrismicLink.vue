<script setup lang="ts">
import { type LinkField, isFilled } from "@prismicio/client"
import { PrismicLink, usePrismic } from "@prismicio/vue"
import { h, markRaw, ref } from "vue"

import TestLink from "../components/TestLink.vue"
import WithPlugin from "../components/WithPlugin.vue"

const { client } = usePrismic()
const { data: tests } = await client.getSingle("link_test")

if (!isFilled.link(tests.document) || tests.document.link_type !== "Document") {
	throw new Error("Expected a document link.")
}
const doc = await client.getByID(tests.document.id)
const unroutedDoc = await client.getSingle("image_test")

const unresolvedDocument = { ...tests.document, url: undefined }
const linkResolver = (link: { type: string }) => `/resolved/${link.type}`
const pluginLinkResolver = (link: { type: string }) => `/plugin/${link.type}`

const reactive = ref<LinkField>(tests.external_web)
</script>

<template>
	<PrismicLink data-testid="empty" :field="tests.empty">foo</PrismicLink>

	<PrismicLink data-testid="internal-web" :field="tests.internal_web">foo</PrismicLink>
	<PrismicLink data-testid="external-web" :field="tests.external_web">foo</PrismicLink>
	<PrismicLink data-testid="external-web-with-target" :field="tests.external_web_with_target">
		foo
	</PrismicLink>
	<PrismicLink data-testid="media" :field="tests.media">foo</PrismicLink>
	<PrismicLink data-testid="document" :field="tests.document">foo</PrismicLink>
	<!-- Internal links would render TestLink instead of an anchor. -->
	<PrismicLink
		v-for="key in ['protocol_relative', 'mailto', 'tel']"
		:key="key"
		:data-testid="key"
		:field="tests[key]"
		:internal-component="markRaw(TestLink)"
	>
		foo
	</PrismicLink>

	<PrismicLink data-testid="document-prop" :document="doc">foo</PrismicLink>
	<PrismicLink data-testid="unrouted-document-prop" :document="unroutedDoc">foo</PrismicLink>

	<PrismicLink data-testid="with-text" :field="tests.with_text" />
	<PrismicLink data-testid="with-text-and-slot" :field="tests.with_text">override</PrismicLink>

	<PrismicLink
		data-testid="link-resolver-prop"
		:field="unresolvedDocument"
		:link-resolver="linkResolver"
	>
		foo
	</PrismicLink>
	<div data-testid="link-resolver-plugin">
		<WithPlugin
			:config="{ linkResolver: pluginLinkResolver }"
			:component="() => h(PrismicLink, { field: unresolvedDocument }, () => 'foo')"
		/>
	</div>
	<div data-testid="link-resolver-prop-over-plugin">
		<WithPlugin
			:config="{ linkResolver: pluginLinkResolver }"
			:component="() => h(PrismicLink, { field: unresolvedDocument, linkResolver }, () => 'foo')"
		/>
	</div>

	<PrismicLink data-testid="rel-string" :field="tests.external_web" rel="foo">foo</PrismicLink>
	<PrismicLink
		data-testid="rel-function"
		:field="tests.external_web"
		:rel="(args) => JSON.stringify(args)"
	>
		foo
	</PrismicLink>

	<div data-testid="external-component-prop">
		<PrismicLink :field="tests.external_web_with_target" :external-component="markRaw(TestLink)">
			foo
		</PrismicLink>
	</div>
	<div data-testid="external-component-plugin">
		<WithPlugin
			:config="{ components: { linkExternalComponent: markRaw(TestLink) } }"
			:component="() => h(PrismicLink, { field: tests.external_web }, () => 'foo')"
		/>
	</div>
	<div data-testid="internal-component-prop">
		<PrismicLink :field="tests.document" :internal-component="markRaw(TestLink)">foo</PrismicLink>
	</div>
	<div data-testid="internal-component-plugin">
		<WithPlugin
			:config="{ components: { linkInternalComponent: markRaw(TestLink) } }"
			:component="() => h(PrismicLink, { field: tests.document }, () => 'foo')"
		/>
	</div>

	<button @click="reactive = tests.internal_web">Change link</button>
	<PrismicLink data-testid="reactive" :field="reactive">foo</PrismicLink>
</template>
