<script setup lang="ts">
import { isFilled } from "@prismicio/client"
import { PrismicTable, usePrismic } from "@prismicio/vue"
import { h, markRaw } from "vue"

import { richTextComponent } from "../components/richText"
import { tableComponent } from "../components/table"
import WithPlugin from "../components/WithPlugin.vue"

const { client } = usePrismic()
const { data: tests } = await client.getSingle("table_test")

if (!isFilled.table(tests.filled)) throw new Error("Expected a filled table field.")
if (isFilled.table(tests.empty)) throw new Error("Expected an empty table field.")

const Fallback = markRaw({ render: () => h("div", "fallback") })

const tableComponents = {
	table: tableComponent("table", "table"),
	thead: tableComponent("thead", "head"),
	tbody: tableComponent("tbody", "body"),
	tr: tableComponent("tr", "row"),
	th: tableComponent("th", "header"),
	td: tableComponent("td", "data"),
}
const cellComponents = {
	paragraph: richTextComponent("p", () => ({ class: "paragraph" })),
	strong: richTextComponent("span", () => ({ class: "strong" })),
	em: richTextComponent("span", () => ({ class: "em" })),
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
		<PrismicTable :field="tests.filled" :components="cellComponents" />
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
