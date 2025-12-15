import { defineComponent, h } from "vue"
import type { PropType } from "vue"

import type { DefaultVueTableComponents } from "./types"

import * as getTableComponentProps from "./getTableComponentProps"

export const defaultTableComponents: DefaultVueTableComponents = {
	table: defineComponent({
		props: {
			...getTableComponentProps.table(),
			as: { type: String as PropType<string | undefined> },
		},
		setup(props, { attrs, slots }) {
			return () =>
				h(props.as ?? "table", attrs, slots.default ? slots.default() : [])
		},
	}),
	thead: defineComponent({
		props: {
			...getTableComponentProps.thead(),
			as: { type: String as PropType<string | undefined> },
		},
		setup(props, { attrs, slots }) {
			return () =>
				h(props.as ?? "thead", attrs, slots.default ? slots.default() : [])
		},
	}),
	tbody: defineComponent({
		props: {
			...getTableComponentProps.tbody(),
			as: { type: String as PropType<string | undefined> },
		},
		setup(props, { attrs, slots }) {
			return () =>
				h(props.as ?? "tbody", attrs, slots.default ? slots.default() : [])
		},
	}),
	tr: defineComponent({
		props: {
			...getTableComponentProps.tr(),
			as: { type: String as PropType<string | undefined> },
		},
		setup(props, { attrs, slots }) {
			return () =>
				h(props.as ?? "tr", attrs, slots.default ? slots.default() : [])
		},
	}),
	th: defineComponent({
		props: {
			...getTableComponentProps.th(),
			as: { type: String as PropType<string | undefined> },
		},
		setup(props, { attrs, slots }) {
			return () =>
				h(props.as ?? "th", attrs, slots.default ? slots.default() : [])
		},
	}),
	td: defineComponent({
		props: {
			...getTableComponentProps.td(),
			as: { type: String as PropType<string | undefined> },
		},
		setup(props, { attrs, slots }) {
			return () =>
				h(props.as ?? "td", attrs, slots.default ? slots.default() : [])
		},
	}),
}
