import { defineComponent, h } from "vue"

import type { VueTableComponents } from "./types"

import * as getTableComponentProps from "./getTableComponentProps"

export const defaultTableComponents: Required<VueTableComponents> = {
	table: defineComponent({
		props: getTableComponentProps.table(),
		setup(props, { slots }) {
			return () => h("table", slots.default ? slots.default() : [])
		},
	}),
	thead: defineComponent({
		props: getTableComponentProps.thead(),
		setup(props, { slots }) {
			return () => h("thead", slots.default ? slots.default() : [])
		},
	}),
	tbody: defineComponent({
		props: getTableComponentProps.tbody(),
		setup(props, { slots }) {
			return () => h("tbody", slots.default ? slots.default() : [])
		},
	}),
	tr: defineComponent({
		props: getTableComponentProps.tr(),
		setup(props, { slots }) {
			return () => h("tr", slots.default ? slots.default() : [])
		},
	}),
	th: defineComponent({
		props: getTableComponentProps.th(),
		setup(props, { slots }) {
			return () => h("th", slots.default ? slots.default() : [])
		},
	}),
	td: defineComponent({
		props: getTableComponentProps.td(),
		setup(props, { slots }) {
			return () => h("td", slots.default ? slots.default() : [])
		},
	}),
}
