<script lang="ts" setup>
import { type TableField, isFilled } from "@prismicio/client"
import { computed } from "vue"

import type { ComponentOrTagName } from "../types"
import type { VueTableComponents } from "./types"

import type { VueRichTextSerializer } from "../PrismicRichText"

import { defaultTableComponents } from "./PrismicTableDefaultComponents"
import PrismicTableRow from "./PrismicTableRow.vue"

/**
 * Props for `<PrismicTable />`.
 */
export type PrismicTableProps = {
	/**
	 * The Prismic table field to render.
	 */
	field: TableField | undefined

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

const mergedComponents = computed(() => ({
	...defaultTableComponents,
	...props.components,
}))
</script>

<template>
	<component
		v-if="isFilled.table(field)"
		:is="mergedComponents.table"
		:table="field"
		v-bind="$attrs"
	>
		<component
			v-if="field.head"
			:is="mergedComponents.thead"
			:head="field.head"
		>
			<PrismicTableRow
				v-for="row in field.head.rows"
				:key="row.key"
				:row="row"
				:components="mergedComponents"
			/>
		</component>
		<component :is="mergedComponents.tbody" :body="field.body">
			<PrismicTableRow
				v-for="row in field.body.rows"
				:key="row.key"
				:row="row"
				:components="mergedComponents"
			/>
		</component>
	</component>
	<component v-else :is="fallback" />
</template>
