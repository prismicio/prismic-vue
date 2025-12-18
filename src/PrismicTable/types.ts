import type {
	TableField,
	TableFieldBody,
	TableFieldBodyRow,
	TableFieldDataCell,
	TableFieldHead,
	TableFieldHeadRow,
	TableFieldHeaderCell,
} from "@prismicio/client"

import type { VueShorthand } from "../PrismicRichText/types"
import type { VueComponent } from "../types"

/**
 * A map of Table block types to Vue Components. It is used to render table
 * fields.
 *
 * @see Templating Table fields from Prismic {@link https://prismic.io/docs/table}
 */
export type VueTableComponents = {
	table?: VueComponent<{ table: TableField<"filled"> }> | VueShorthand
	thead?: VueComponent<{ head: TableFieldHead }> | VueShorthand
	tbody?: VueComponent<{ body: TableFieldBody }> | VueShorthand
	tr?:
		| VueComponent<{ row: TableFieldBodyRow | TableFieldHeadRow }>
		| VueShorthand
	th?: VueComponent<{ cell: TableFieldHeaderCell }> | VueShorthand
	td?: VueComponent<{ cell: TableFieldDataCell }> | VueShorthand
}

export type DefaultVueTableComponents = {
	table: VueComponent<{ table: TableField<"filled">; as?: string }>
	thead: VueComponent<{ head: TableFieldHead; as?: string }>
	tbody: VueComponent<{ body: TableFieldBody; as?: string }>
	tr: VueComponent<{ row: TableFieldBodyRow | TableFieldHeadRow; as?: string }>
	th: VueComponent<{ cell: TableFieldHeaderCell; as?: string }>
	td: VueComponent<{ cell: TableFieldDataCell; as?: string }>
}

export type InternalVueTableComponents = {
	table: { is: VueTableComponents["table"]; shorthand?: VueShorthand }
	thead: { is: VueTableComponents["thead"]; shorthand?: VueShorthand }
	tbody: { is: VueTableComponents["tbody"]; shorthand?: VueShorthand }
	tr: { is: VueTableComponents["tr"]; shorthand?: VueShorthand }
	th: { is: VueTableComponents["th"]; shorthand?: VueShorthand }
	td: { is: VueTableComponents["td"]; shorthand?: VueShorthand }
}
