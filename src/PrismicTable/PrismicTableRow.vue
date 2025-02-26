<script lang="ts" setup>
import type {
	TableFieldBodyRow,
	TableFieldDataCell,
	TableFieldHeadRow,
	TableFieldHeaderCell,
} from "@prismicio/client"
import { computed, defineComponent, h } from "vue"
import type { PropType } from "vue"

import type { VueRichTextSerializer } from "../PrismicRichText/types"
import type { VueTableComponents } from "./types"

import PrismicRichText from "../PrismicRichText/PrismicRichText.vue"

const defaultRowComponents: Required<
	Pick<VueTableComponents, "tr" | "th" | "td">
> = {
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

/**
 * Props for `<PrismicRowTable />`.
 */
export type PrismicTableRowProps = {
	/**
	 * The Prismic table row to render.
	 */
	row: TableFieldHeadRow | TableFieldBodyRow

	/**
	 * An object that maps a table block type to a Vue component.
	 *
	 * @example
	 *
	 * ```javascript
	 * {
	 *   tr: TableRow,
	 * }
	 * ```
	 */
	components?: VueTableComponents & VueRichTextSerializer
}

const props = defineProps<PrismicTableRowProps>()
defineOptions({ name: "PrismicTableRow" })

const mergedComponents = computed(() => ({
	...defaultRowComponents,
	...props.components,
}))
const stringify = (obj: unknown): string => JSON.stringify(obj)
</script>

<template>
	<component :is="mergedComponents.tr" :row="row">
		<template v-for="cell in row.cells" :key="stringify(cell)">
			<component
				v-if="cell.type === 'header'"
				:is="mergedComponents.th"
				:cell="cell"
			>
				<PrismicRichText :field="cell.content" :components="components" />
			</component>
			<component v-else :is="mergedComponents.td" :cell="cell">
				<PrismicRichText :field="cell.content" :components="components" />
			</component>
		</template>
	</component>
</template>
