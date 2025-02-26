import type {
	TableField,
	TableFieldBody,
	TableFieldBodyRow,
	TableFieldDataCell,
	TableFieldHead,
	TableFieldHeadRow,
	TableFieldHeaderCell,
} from "@prismicio/client"
import { defineComponent, h } from "vue"
import type { PropType } from "vue"

import type { VueTableComponents } from "./types"

export const defaultTableComponents: Required<
	Pick<VueTableComponents, "table" | "thead" | "tbody" | "tr" | "th" | "td">
> = {
	table: defineComponent({
		props: { table: Object as PropType<TableField> },
		setup(props, { slots }) {
			return () => h("table", slots.default ? slots.default() : [])
		},
	}),
	thead: defineComponent({
		props: { head: Object as PropType<TableFieldHead> },
		setup(props, { slots }) {
			return () => h("thead", slots.default ? slots.default() : [])
		},
	}),
	tbody: defineComponent({
		props: { body: Object as PropType<TableFieldBody> },
		setup(props, { slots }) {
			return () => h("tbody", slots.default ? slots.default() : [])
		},
	}),
	tr: defineComponent({
		props: { row: Object as PropType<TableFieldHeadRow | TableFieldBodyRow> },
		setup(props, { slots }) {
			return () => h("tr", slots.default ? slots.default() : [])
		},
	}),
	th: defineComponent({
		props: { cell: Object as PropType<TableFieldHeaderCell> },
		setup(props, { slots }) {
			return () => h("th", slots.default ? slots.default() : [])
		},
	}),
	td: defineComponent({
		props: { cell: Object as PropType<TableFieldDataCell> },
		setup(props, { slots }) {
			return () => h("td", slots.default ? slots.default() : [])
		},
	}),
}
