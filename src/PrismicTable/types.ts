import type {
	TableField,
	TableFieldBody,
	TableFieldBodyRow,
	TableFieldDataCell,
	TableFieldHead,
	TableFieldHeadRow,
	TableFieldHeaderCell,
} from "@prismicio/client"
import type {
	DefineComponent,
	FunctionalComponent,
	defineAsyncComponent,
} from "vue"

/**
 * Types enum for TableNodes
 *
 * @see More details: {@link https://prismic.io/docs/table}
 */
export declare const TableNodeType: {
	readonly table: "table"
	readonly thead: "thead"
	readonly tbody: "tbody"
	readonly tr: "tr"
	readonly th: "th"
	readonly td: "td"
}

/**
 * A map of Table block types to Vue Components. It is used to render table
 * fields.
 *
 * @see Templating Table fields from Prismic {@link https://prismic.io/docs/table}
 */
export type VueTableComponents = Partial<
	Record<keyof typeof TableNodeType, VueTableComponent>
>

export type TAnyNode =
	| TableField
	| TableFieldBody
	| TableFieldBodyRow
	| TableFieldDataCell
	| TableFieldHead
	| TableFieldHeadRow
	| TableFieldHeaderCell

/**
 * Props for a component rendering nodes from a Prismic table field.
 */
export type TableComponentProps<TTNode extends TAnyNode = TAnyNode> = {
	node: TTNode
}

/**
 * A Vue component rendering a node from a Prismic table field.
 *
 * @typeParam TTNode - The type of table node(s) this component handles
 */
export type VueTableComponent<TTNode extends TAnyNode = TAnyNode> =
	| ReturnType<typeof defineAsyncComponent>
	| DefineComponent<TableComponentProps<TTNode>>
	| FunctionalComponent<TableComponentProps<TTNode>>
