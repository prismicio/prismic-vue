import type {
	TableField,
	TableFieldBody,
	TableFieldBodyRow,
	TableFieldDataCell,
	TableFieldHead,
	TableFieldHeadRow,
	TableFieldHeaderCell,
} from "@prismicio/client"

import type { VueComponent, VueComponentShorthand } from "../types"

/**
 * A map of Table block types to Vue Components. It is used to render table
 * fields.
 *
 * @see Templating Table fields from Prismic {@link https://prismic.io/docs/table}
 */
export type VueTableComponents = {
	table?:
		| VueComponent<{ table: TableField<"filled"> }>
		| Omit<VueComponentShorthand, "as">
	thead?:
		| VueComponent<{ head: TableFieldHead }>
		| Omit<VueComponentShorthand, "as">
	tbody?:
		| VueComponent<{ body: TableFieldBody }>
		| Omit<VueComponentShorthand, "as">
	tr?:
		| VueComponent<{ row: TableFieldBodyRow | TableFieldHeadRow }>
		| Omit<VueComponentShorthand, "as">
	th?:
		| VueComponent<{ cell: TableFieldHeaderCell }>
		| Omit<VueComponentShorthand, "as">
	td?:
		| VueComponent<{ cell: TableFieldDataCell }>
		| Omit<VueComponentShorthand, "as">
}

export type InternalVueTableComponents = {
	table: {
		is: VueTableComponents["table"]
		shorthand?: Omit<VueComponentShorthand, "as">
	}
	thead: {
		is: VueTableComponents["thead"]
		shorthand?: Omit<VueComponentShorthand, "as">
	}
	tbody: {
		is: VueTableComponents["tbody"]
		shorthand?: Omit<VueComponentShorthand, "as">
	}
	tr: {
		is: VueTableComponents["tr"]
		shorthand?: Omit<VueComponentShorthand, "as">
	}
	th: {
		is: VueTableComponents["th"]
		shorthand?: Omit<VueComponentShorthand, "as">
	}
	td: {
		is: VueTableComponents["td"]
		shorthand?: Omit<VueComponentShorthand, "as">
	}
}
