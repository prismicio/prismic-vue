<script lang="ts" setup>
import type { TableFieldBodyRow, TableFieldHeadRow } from "@prismicio/client"

import type { VueTableComponents } from "./types"

import type { VueRichTextSerializer } from "../PrismicRichText"
import PrismicRichText from "../PrismicRichText/PrismicRichText.vue"

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
	components: VueTableComponents & VueRichTextSerializer
}

const props = defineProps<PrismicTableRowProps>()
defineOptions({ name: "PrismicTableRow" })
</script>

<template>
	<component :is="props.components.tr" :row="row">
		<template v-for="cell in row.cells" :key="cell.key">
			<component
				v-if="cell.type === 'header'"
				:is="props.components.th"
				:cell="cell"
			>
				<PrismicRichText :field="cell.content" :components="components" />
			</component>
			<component v-else :is="props.components.td" :cell="cell">
				<PrismicRichText :field="cell.content" :components="props.components" />
			</component>
		</template>
	</component>
</template>
