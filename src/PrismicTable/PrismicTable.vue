<script lang="ts" setup>
import {
	type TableField,
	type TableFieldBody,
	type TableFieldHead,
	isFilled,
} from "@prismicio/client"
import { computed, defineComponent, h } from "vue"
import type { PropType } from "vue"

import type { VueRichTextSerializer } from "../PrismicRichText/types"
import type { ComponentOrTagName } from "../types"
import type { VueTableComponents } from "./types"

import PrismicTableRow from "./PrismicTableRow.vue"

const defaultComponents: Required<
	Pick<VueTableComponents, "table" | "thead" | "tbody">
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
}

/**
 * Props for `<PrismicTable />`.
 */
export type PrismicTableProps = {
	/**
	 * The Prismic table field to render.
	 */
	field: TableField | null | undefined

	/**
	 * The value to be rendered when the field is empty. If a fallback is not
	 * given, `null` (nothing) will be rendered.
	 */
	fallback?: ComponentOrTagName

	/**
	 * An object that maps a table block type to a Vue component.
	 *
	 * @example
	 *
	 * ```javascript
	 * {
	 *   table: Table,
	 * }
	 * ```
	 */
	components?: VueTableComponents & VueRichTextSerializer
}

const props = defineProps<PrismicTableProps>()
defineOptions({ name: "PrismicTable" })

const isFilledTable = computed(() => isFilled.table(props.field))
const mergedComponents = computed(() => ({
	...defaultComponents,
	...props.components,
}))
const stringify = (obj: unknown): string => JSON.stringify(obj)
</script>

<template>
	<component
		v-if="isFilledTable && field"
		:is="mergedComponents.table"
		:table="field"
	>
		<component
			v-if="field.head"
			:is="mergedComponents.thead"
			:head="field.head"
		>
			<PrismicTableRow
				v-for="row in field.head.rows"
				:key="stringify(row)"
				:row="row"
				:components="mergedComponents"
			/>
		</component>
		<component :is="mergedComponents.tbody" :body="field.body">
			<PrismicTableRow
				v-for="row in field.body.rows"
				:key="stringify(row)"
				:row="row"
				:components="mergedComponents"
			/>
		</component>
	</component>
	<component v-else :is="fallback" />
</template>
