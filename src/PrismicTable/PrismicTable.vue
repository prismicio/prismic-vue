<script lang="ts" setup>
import { type TableField, isFilled } from "@prismicio/client"
import { computed } from "vue"

import type { ComponentOrTagName, ComponentShorthand } from "../types"
import { isComponent } from "../types"
import type { InternalTableComponents, TableComponents } from "./types"

import type { RichTextComponents } from "../PrismicRichText"
import { usePrismic } from "../createPrismic"

import { defaultTableComponents } from "./PrismicTableDefaultComponents"
import PrismicTableRow from "./PrismicTableRow.vue"

/** Props for `<PrismicTable />`. */
export type PrismicTableProps = {
	/** The Prismic table field to render. */
	field: TableField | undefined

	/**
	 * An object that maps a table block type to a Vue component or a shorthand
	 * definition.
	 *
	 * @example
	 *
	 * ```javascript
	 * {
	 *   table: Table,
	 *   thead: { class: 'bg-black text-white' },
	 *   th: { as: 'td', class: 'font-bold' },
	 * }
	 * ```
	 */
	components?: TableComponents & RichTextComponents

	/**
	 * The value to be rendered when the field is empty. If a fallback is not
	 * given, `null` (nothing) will be rendered.
	 */
	fallback?: ComponentOrTagName
}

const props = defineProps<PrismicTableProps>()
defineOptions({ name: "PrismicTable" })

const { componentsConfig } = usePrismic()

const resolvedComponents = computed<TableComponents & RichTextComponents>(
	() => {
		return { ...componentsConfig?.defaultComponents, ...props.components }
	},
)

function getInternalComponent(type: keyof TableComponents) {
	const maybeComponentOrShorthand = resolvedComponents.value?.[type]

	if (isComponent(maybeComponentOrShorthand)) {
		return { is: maybeComponentOrShorthand }
	}

	return {
		is: defaultTableComponents[type],
		shorthand: maybeComponentOrShorthand as ComponentShorthand,
	}
}

const internalTableComponents = computed<InternalTableComponents>(() => {
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
		:is="internalTableComponents.table.is"
		:table="field"
		v-bind="{ ...$attrs, ...internalTableComponents.table.shorthand }"
	>
		<component
			v-if="field.head"
			:is="internalTableComponents.thead.is"
			:head="field.head"
			v-bind="internalTableComponents.thead.shorthand"
		>
			<PrismicTableRow
				v-for="row in field.head.rows"
				:key="row.key"
				:row="row"
				:internalTableComponents="internalTableComponents"
				:components="components"
			/>
		</component>
		<component
			:is="internalTableComponents.tbody.is"
			:body="field.body"
			v-bind="internalTableComponents.tbody.shorthand"
		>
			<PrismicTableRow
				v-for="row in field.body.rows"
				:key="row.key"
				:row="row"
				:internalTableComponents="internalTableComponents"
				:components="components"
			/>
		</component>
	</component>
	<component v-else-if="fallback" :is="fallback" v-bind="$attrs" />
</template>
