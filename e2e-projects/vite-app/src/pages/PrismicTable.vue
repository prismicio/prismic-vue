<script setup lang="ts">
import { isFilled } from "@prismicio/client"
import { PrismicTable, usePrismic } from "@prismicio/vue"
import { h, markRaw } from "vue"

import Em from "../components/richText/Em.vue"
import Paragraph from "../components/richText/Paragraph.vue"
import Strong from "../components/richText/Strong.vue"
import Body from "../components/table/Body.vue"
import Data from "../components/table/Data.vue"
import Head from "../components/table/Head.vue"
import Header from "../components/table/Header.vue"
import Row from "../components/table/Row.vue"
import Table from "../components/table/Table.vue"
import WithPlugin from "../components/WithPlugin.vue"

const { client } = usePrismic()
const { data: tests } = await client.getSingle("table_test")

if (!isFilled.table(tests.filled)) throw new Error("Expected a filled table field.")
if (isFilled.table(tests.empty)) throw new Error("Expected an empty table field.")

const Fallback = markRaw({ render: () => h("div", "fallback") })

const tableComponents = {
	table: Table,
	thead: Head,
	tbody: Body,
	tr: Row,
	th: Header,
	td: Data,
}
</script>

<template>
	<div data-testid="filled"><PrismicTable :field="tests.filled" /></div>
	<div data-testid="empty"><PrismicTable :field="tests.empty" /></div>
	<div data-testid="fallback"><PrismicTable :field="tests.empty" :fallback="Fallback" /></div>

	<div data-testid="custom-table">
		<PrismicTable :field="tests.filled" :components="tableComponents" />
	</div>
	<div data-testid="custom-table-plugin">
		<WithPlugin
			:config="{ components: { richTextComponents: tableComponents } }"
			:component="() => h(PrismicTable, { field: tests.filled })"
		/>
	</div>
	<div data-testid="custom-cell-content">
		<PrismicTable
			:field="tests.filled"
			:components="{ paragraph: Paragraph, strong: Strong, em: Em }"
		/>
	</div>

	<div data-testid="shorthand-table">
		<PrismicTable
			:field="tests.filled"
			:components="{
				table: { class: 'table' },
				thead: { class: 'head' },
				tbody: { class: 'body' },
				tr: { class: 'row' },
				th: { class: 'header' },
				td: { class: 'data' },
			}"
		/>
	</div>
	<div data-testid="shorthand-cell-content">
		<PrismicTable
			:field="tests.filled"
			:components="{ paragraph: { as: 'p', class: 'paragraph' }, strong: { as: 'b' } }"
		/>
	</div>
</template>
