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
 * A map of Table block types to Vue Components. It is used to render table
 * fields.
 *
 * @see Templating Table fields from Prismic {@link https://prismic.io/docs/table}
 */
export type VueTableComponents = {
	table?: VueComponent<{ table: TableField<"filled"> }>
	thead?: VueComponent<{ head: TableFieldHead }>
	tbody?: VueComponent<{ body: TableFieldBody }>
	tr?: VueComponent<{ row: TableFieldBodyRow | TableFieldHeadRow }>
	th?: VueComponent<{ cell: TableFieldHeaderCell }>
	td?: VueComponent<{ cell: TableFieldDataCell }>
}

type VueComponent<TProps> =
	| ReturnType<typeof defineAsyncComponent>
	| DefineComponent<TProps>
	| FunctionalComponent<TProps>
