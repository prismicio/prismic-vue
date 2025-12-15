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
import type { VueShorthand } from "../PrismicRichText/types"

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
	tr?: VueComponent<{ row: TableFieldBodyRow | TableFieldHeadRow }> | VueShorthand
	th?: VueComponent<{ cell: TableFieldHeaderCell }> | VueShorthand
	td?: VueComponent<{ cell: TableFieldDataCell }> | VueShorthand
}

export type InternalVueTableComponents = {
	table: VueComponent<{ table: TableField<"filled">; as?: string }>
	thead: VueComponent<{ head: TableFieldHead; as?: string }>
	tbody: VueComponent<{ body: TableFieldBody; as?: string }>
	tr: VueComponent<{ row: TableFieldBodyRow | TableFieldHeadRow; as?: string }>
	th: VueComponent<{ cell: TableFieldHeaderCell; as?: string }>
	td: VueComponent<{ cell: TableFieldDataCell; as?: string }>
}

type VueComponent<TProps> =
	| ReturnType<typeof defineAsyncComponent>
	| DefineComponent<TProps>
	| FunctionalComponent<TProps>
