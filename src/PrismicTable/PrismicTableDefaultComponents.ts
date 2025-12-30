import { defineComponent, h } from "vue"

import type { TableComponents } from "./types"

import * as getTableComponentProps from "./getTableComponentProps"

export const defaultTableComponents: Required<TableComponents> = {
	table: defineComponent({
		props: getTableComponentProps.table(),
		setup(props, { attrs, slots }) {
			return () => h("table", attrs, slots.default ? slots.default() : [])
		},
	}),
	thead: defineComponent({
		props: getTableComponentProps.thead(),
		setup(props, { attrs, slots }) {
			return () => h("thead", attrs, slots.default ? slots.default() : [])
		},
	}),
	tbody: defineComponent({
		props: getTableComponentProps.tbody(),
		setup(props, { attrs, slots }) {
			return () => h("tbody", attrs, slots.default ? slots.default() : [])
		},
	}),
	tr: defineComponent({
		props: getTableComponentProps.tr(),
		setup(props, { attrs, slots }) {
			return () => h("tr", attrs, slots.default ? slots.default() : [])
		},
	}),
	th: defineComponent({
		props: getTableComponentProps.th(),
		setup(props, { attrs, slots }) {
			return () => h("th", attrs, slots.default ? slots.default() : [])
		},
	}),
	td: defineComponent({
		props: getTableComponentProps.td(),
		setup(props, { attrs, slots }) {
			return () => h("td", attrs, slots.default ? slots.default() : [])
		},
	}),
}
