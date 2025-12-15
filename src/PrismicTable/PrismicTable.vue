<script lang="ts" setup>
import { type TableField, isFilled } from "@prismicio/client"
import { computed } from "vue"

import type { VueShorthand } from "../PrismicRichText/types"
import { type ComponentOrTagName, isVueComponent } from "../types"
import type { InternalVueTableComponents, VueTableComponents } from "./types"

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

	/**
	 * The value to be rendered when the field is empty. If a fallback is not
	 * given, `null` (nothing) will be rendered.
	 */
	fallback?: ComponentOrTagName
}

const props = defineProps<PrismicTableProps>()
defineOptions({ name: "PrismicTable" })

function getInternalComponent(type: keyof VueTableComponents) {
	const maybeComponentOrShorthand = props.components?.[type]

	if (isVueComponent(maybeComponentOrShorthand)) {
		return { is: maybeComponentOrShorthand }
	}

	return {
		is: defaultTableComponents[type],
		shorthand: maybeComponentOrShorthand as VueShorthand,
	}
}

const tableComponents = computed<InternalVueTableComponents>(() => {
	return {
		table: getInternalComponent("table"),
		thead: getInternalComponent("thead"),
		tbody: getInternalComponent("tbody"),
		tr: getInternalComponent("tr"),
		th: getInternalComponent("th"),
		td: getInternalComponent("td"),
	}
})
</script>

<template>
	<component
		v-if="isFilled.table(field)"
		:is="tableComponents.table.is"
		:table="field"
		v-bind="{ ...$attrs, ...tableComponents.table.shorthand }"
	>
		<component
			v-if="field.head"
			:is="tableComponents.thead.is"
			:head="field.head"
			v-bind="tableComponents.thead.shorthand"
		>
			<PrismicTableRow
				v-for="row in field.head.rows"
				:key="row.key"
				:row="row"
				:internalTableComponents="tableComponents"
				:components="components"
			/>
		</component>
		<component
			:is="tableComponents.tbody.is"
			:body="field.body"
			v-bind="tableComponents.tbody.shorthand"
		>
			<PrismicTableRow
				v-for="row in field.body.rows"
				:key="row.key"
				:row="row"
				:internalTableComponents="tableComponents"
				:components="components"
			/>
		</component>
	</component>
	<component v-else-if="fallback" :is="fallback" />
</template>
