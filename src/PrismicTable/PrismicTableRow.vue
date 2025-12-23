<script lang="ts" setup>
import type { TableFieldBodyRow, TableFieldHeadRow } from "@prismicio/client"

import type { InternalVueTableComponents } from "./types"

import type { VueRichTextComponents } from "../PrismicRichText"
import PrismicRichText from "../PrismicRichText/PrismicRichText.vue"

export type PrismicTableRowProps = {
	row: TableFieldHeadRow | TableFieldBodyRow
	internalTableComponents: InternalVueTableComponents
	components?: VueRichTextComponents
}

const props = defineProps<PrismicTableRowProps>()
defineOptions({ name: "PrismicTableRow" })
</script>

<template>
	<component
		:is="internalTableComponents.tr.is"
		:row="row"
		v-bind="internalTableComponents.tr.shorthand"
	>
		<template v-for="cell in row.cells" :key="cell.key">
			<component
				v-if="cell.type === 'header'"
				:is="internalTableComponents.th.is"
				:cell="cell"
				v-bind="internalTableComponents.th.shorthand"
			>
				<PrismicRichText :field="cell.content" :components="components" />
			</component>
			<component
				v-else
				:is="internalTableComponents.td.is"
				:cell="cell"
				v-bind="internalTableComponents.td.shorthand"
			>
				<PrismicRichText :field="cell.content" :components="components" />
			</component>
		</template>
	</component>
</template>
