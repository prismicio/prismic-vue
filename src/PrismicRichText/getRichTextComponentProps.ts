import type { RTAnyNode } from "@prismicio/client"
import type { PropType } from "vue"

import type { RichTextComponentProps } from "./types"

/**
 * Native Vue props for a component rendering nodes from a Prismic rich text
 * field using the `<PrismicRichText />` component.
 *
 * @typeParam TRTNode - The type of rich text node(s) this component handles
 */
type DefineComponentRichTextComponentProps<
	TRTNode extends RTAnyNode = RTAnyNode,
> = {
	node: {
		type: PropType<RichTextComponentProps<TRTNode>["node"]>
		required: true
	}
}

/**
 * Gets native Vue props for a component rendering nodes from a Prismic rich
 * text field using the `<PrismicRichText />` component.
 *
 * Props are: `["node"]`
 *
 * @example
 *
 * ```javascript
 * // Defining a new rich text component
 * import { getRichTextComponentProps } from "@prismicio/vue"
 *
 * defineProps(getRichTextComponentProps())
 * ```
 *
 * @example
 *
 * ```typescript
 * // Defining a new rich text component for a specific node type
 * import { getRichTextComponentProps } from "@prismicio/vue"
 *
 * defineProps(getRichTextComponentProps("heading1"))
 * ```
 *
 * @typeParam TRTType - The type of rich text node(s) this component handles
 *
 * @param type - The type of rich text node this component handles
 *
 * @returns Props object to use with `defineProps()`
 */
export const getRichTextComponentProps = <TRTType extends RTAnyNode["type"]>(
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type?: TRTType,
): DefineComponentRichTextComponentProps<
	Extract<RTAnyNode, { type: TRTType }>
> => ({
	node: {
		type: Object as PropType<
			RichTextComponentProps<Extract<RTAnyNode, { type: TRTType }>>["node"]
		>,
		required: true,
	},
})
