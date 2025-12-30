import type {
	TableField,
	TableFieldBody,
	TableFieldBodyRow,
	TableFieldDataCell,
	TableFieldHead,
	TableFieldHeadRow,
	TableFieldHeaderCell,
} from "@prismicio/client"

import type { Component, ComponentShorthand } from "../types"

/**
 * A map of Table block types to Vue Components. It is used to render table
 * fields.
 *
 * @see Templating Table fields from Prismic {@link https://prismic.io/docs/table}
 */
export type TableComponents = {
	table?:
		| Component<{ table: TableField<"filled"> }>
		| Omit<ComponentShorthand, "as">
	thead?:
		| Component<{ head: TableFieldHead }>
		| Omit<ComponentShorthand, "as">
	tbody?:
		| Component<{ body: TableFieldBody }>
		| Omit<ComponentShorthand, "as">
	tr?:
		| Component<{ row: TableFieldBodyRow | TableFieldHeadRow }>
		| Omit<ComponentShorthand, "as">
	th?:
		| Component<{ cell: TableFieldHeaderCell }>
		| Omit<ComponentShorthand, "as">
	td?:
		| Component<{ cell: TableFieldDataCell }>
		| Omit<ComponentShorthand, "as">
}

export type InternalTableComponents = {
	table: {
		is: TableComponents["table"]
		shorthand?: Omit<ComponentShorthand, "as">
	}
	thead: {
		is: TableComponents["thead"]
		shorthand?: Omit<ComponentShorthand, "as">
	}
	tbody: {
		is: TableComponents["tbody"]
		shorthand?: Omit<ComponentShorthand, "as">
	}
	tr: {
		is: TableComponents["tr"]
		shorthand?: Omit<ComponentShorthand, "as">
	}
	th: {
		is: TableComponents["th"]
		shorthand?: Omit<ComponentShorthand, "as">
	}
	td: {
		is: TableComponents["td"]
		shorthand?: Omit<ComponentShorthand, "as">
	}
}
