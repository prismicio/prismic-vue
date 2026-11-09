<script setup lang="ts">
import { type RichTextField, isFilled } from "@prismicio/client"
import { PrismicRichText, usePrismic } from "@prismicio/vue"
import { h, markRaw, ref } from "vue"

import { richTextComponent } from "../components/richText"
import TestLink from "../components/TestLink.vue"
import WithPlugin from "../components/WithPlugin.vue"

const { client } = usePrismic()
const { data: tests } = await client.getSingle("rich_text_test")

if (!isFilled.richText(tests.filled)) throw new Error("Expected a filled rich text field.")
if (isFilled.richText(tests.empty)) throw new Error("Expected an empty rich text field.")

const Fallback = markRaw({ render: () => h("div", "fallback") })
const Bar = richTextComponent("div")
const InlineBar = richTextComponent("span")
const Baz = richTextComponent("div", () => ({ "data-baz": "true" }))

const blocks = [
	"heading1",
	"heading2",
	"heading3",
	"heading4",
	"heading5",
	"heading6",
	"paragraph",
	"preformatted",
]

const linkResolver = (link: { type: string }) => `/resolved/${link.type}`

const reactive = ref<RichTextField>(tests.heading1)
</script>

<template>
	<div data-testid="filled"><PrismicRichText :field="tests.filled" /></div>
	<div data-testid="empty"><PrismicRichText :field="tests.empty" /></div>
	<div data-testid="fallback"><PrismicRichText :field="tests.empty" :fallback="Fallback" /></div>

	<div v-for="block in blocks" :key="block" :data-testid="block">
		<div data-testid="default"><PrismicRichText :field="tests[block]" /></div>
		<div data-testid="custom">
			<PrismicRichText :field="tests[block]" :components="{ [block]: Bar }" />
		</div>
	</div>

	<div data-testid="strong">
		<div data-testid="default"><PrismicRichText :field="tests.strong" /></div>
		<div data-testid="custom">
			<PrismicRichText :field="tests.strong" :components="{ strong: InlineBar }" />
		</div>
	</div>

	<div data-testid="em">
		<div data-testid="default"><PrismicRichText :field="tests.em" /></div>
		<div data-testid="custom">
			<PrismicRichText :field="tests.em" :components="{ em: InlineBar }" />
		</div>
	</div>

	<div data-testid="list">
		<div data-testid="default"><PrismicRichText :field="tests.list" /></div>
		<div data-testid="custom">
			<PrismicRichText :field="tests.list" :components="{ list: Bar, listItem: Baz }" />
		</div>
	</div>

	<div data-testid="ordered-list">
		<div data-testid="default"><PrismicRichText :field="tests.ordered_list" /></div>
		<div data-testid="custom">
			<PrismicRichText :field="tests.ordered_list" :components="{ oList: Bar, oListItem: Baz }" />
		</div>
	</div>

	<div data-testid="image">
		<div data-testid="default"><PrismicRichText :field="tests.image" /></div>
		<div data-testid="custom">
			<PrismicRichText
				:field="tests.image"
				:components="{
					image: richTextComponent('div', (node) => ({
						'data-bar': 'true',
						'data-src': 'url' in node ? node.url : undefined,
					})),
				}"
			/>
		</div>
	</div>

	<div data-testid="embed">
		<div data-testid="default"><PrismicRichText :field="tests.embed" /></div>
		<div data-testid="custom">
			<PrismicRichText
				:field="tests.embed"
				:components="{
					embed: richTextComponent('div', (node) => ({
						'data-bar': 'true',
						'data-html': 'oembed' in node ? node.oembed.html : undefined,
					})),
				}"
			/>
		</div>
	</div>

	<div data-testid="hyperlink">
		<div data-testid="default"><PrismicRichText :field="tests.hyperlink_external" /></div>
		<div data-testid="internal"><PrismicRichText :field="tests.hyperlink_internal" /></div>
		<div data-testid="document"><PrismicRichText :field="tests.hyperlink_document" /></div>
		<div data-testid="link-resolver">
			<PrismicRichText :field="tests.hyperlink_document" :link-resolver="linkResolver" />
		</div>
		<div data-testid="custom">
			<PrismicRichText
				:field="tests.hyperlink_external"
				:components="{
					hyperlink: richTextComponent('span', (node) => ({
						'data-bar': 'true',
						'data-url': node.type === 'hyperlink' ? node.data.url : undefined,
					})),
				}"
			/>
		</div>
		<div data-testid="custom-internal">
			<WithPlugin
				:config="{ components: { linkInternalComponent: markRaw(TestLink) } }"
				:component="() => h(PrismicRichText, { field: tests.hyperlink_internal })"
			/>
		</div>
		<div data-testid="custom-external">
			<WithPlugin
				:config="{ components: { linkExternalComponent: markRaw(TestLink) } }"
				:component="() => h(PrismicRichText, { field: tests.hyperlink_external })"
			/>
		</div>
	</div>

	<div data-testid="label">
		<div data-testid="default"><PrismicRichText :field="tests.label" /></div>
		<div data-testid="custom">
			<PrismicRichText
				:field="tests.label"
				:components="{
					label: richTextComponent('span', (node) => ({
						'data-bar': 'true',
						'data-label': node.type === 'label' ? node.data.label : undefined,
					})),
				}"
			/>
		</div>
	</div>

	<div data-testid="shorthand">
		<PrismicRichText
			:field="[...tests.heading1, ...tests.heading2]"
			:components="{
				heading1: { class: 'heading-1' },
				heading2: { as: 'h3', class: 'heading-2' },
			}"
		/>
	</div>

	<div data-testid="plugin-components">
		<WithPlugin
			:config="{ components: { richTextComponents: { heading1: Bar } } }"
			:component="() => h(PrismicRichText, { field: tests.heading1 })"
		/>
	</div>
	<div data-testid="props-over-plugin-components">
		<WithPlugin
			:config="{ components: { richTextComponents: { heading1: Bar } } }"
			:component="
				() => h(PrismicRichText, { field: tests.heading1, components: { heading1: Baz } })
			"
		/>
	</div>

	<button @click="reactive = tests.paragraph">Change field</button>
	<div data-testid="reactive"><PrismicRichText :field="reactive" /></div>
</template>
