import type {
	TableField,
	TableFieldBody,
	TableFieldBodyRow,
	TableFieldDataCell,
	TableFieldHead,
	TableFieldHeadRow,
	TableFieldHeaderCell,
} from "@prismicio/client"
import type { PropType } from "vue"

/**
 * Gets native Vue props for a component rendering `table` elements from a
 * Prismic table field with `<PrismicTable />`.
 *
 * Props are: `["table"]`
 *
 * @example
 *
 * ```javascript
 * // Defining a new rich text component
 * import { getTableComponentProps } from "@prismicio/vue"
 *
 * defineProps(getTableComponentProps.table())
 * ```
 */
export const table = (): {
	table: { type: PropType<TableField<"filled">>; required: true }
} => ({
	table: { type: Object as PropType<TableField<"filled">>, required: true },
})

/**
 * Gets native Vue props for a component rendering `thead` elements from a
 * Prismic table field with `<PrismicTable />`.
 *
 * Props are: `["head"]`
 *
 * @example
 *
 * ```javascript
 * // Defining a new rich text component
 * import { getTableComponentProps } from "@prismicio/vue"
 *
 * defineProps(getTableComponentProps.thead())
 * ```
 */
export const thead = (): {
	head: { type: PropType<TableFieldHead>; required: true }
} => ({
	head: { type: Object as PropType<TableFieldHead>, required: true },
})

/**
 * Gets native Vue props for a component rendering `tbody` elements from a
 * Prismic table field with `<PrismicTable />`.
 *
 * Props are: `["body"]`
 *
 * @example
 *
 * ```javascript
 * // Defining a new rich text component
 * import { getTableComponentProps } from "@prismicio/vue"
 *
 * defineProps(getTableComponentProps.body())
 * ```
 */
export const tbody = (): {
	body: { type: PropType<TableFieldBody>; required: true }
} => ({
	body: { type: Object as PropType<TableFieldBody>, required: true },
})

/**
 * Gets native Vue props for a component rendering `tr` elements from a Prismic
 * table field with `<PrismicTable />`.
 *
 * Props are: `["row"]`
 *
 * @example
 *
 * ```javascript
 * // Defining a new rich text component
 * import { getTableComponentProps } from "@prismicio/vue"
 *
 * defineProps(getTableComponentProps.tr())
 * ```
 */
export const tr = (): {
	row: {
		type: PropType<TableFieldHeadRow | TableFieldBodyRow>
		required: true
	}
} => ({
	row: {
		type: Object as PropType<TableFieldHeadRow | TableFieldBodyRow>,
		required: true,
	},
})

/**
 * Gets native Vue props for a component rendering `th` elements from a Prismic
 * table field with `<PrismicTable />`.
 *
 * Props are: `["cell"]`
 *
 * @example
 *
 * ```javascript
 * // Defining a new rich text component
 * import { getTableComponentProps } from "@prismicio/vue"
 *
 * defineProps(getTableComponentProps.th())
 * ```
 */
export const th = (): {
	cell: { type: PropType<TableFieldHeaderCell>; required: true }
} => ({
	cell: { type: Object as PropType<TableFieldHeaderCell>, required: true },
})

/**
 * Gets native Vue props for a component rendering `td` elements from a Prismic
 * table field with `<PrismicTable />`.
 *
 * Props are: `["cell"]`
 *
 * @example
 *
 * ```javascript
 * // Defining a new rich text component
 * import { getTableComponentProps } from "@prismicio/vue"
 *
 * defineProps(getTableComponentProps.td())
 * ```
 */
export const td = (): {
	cell: { type: PropType<TableFieldDataCell>; required: true }
} => ({
	cell: { type: Object as PropType<TableFieldDataCell>, required: true },
})
