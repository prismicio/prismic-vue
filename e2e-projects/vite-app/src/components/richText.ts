import type { RTAnyNode } from "@prismicio/client"
import { getRichTextComponentProps } from "@prismicio/vue"
import { type Component, defineComponent, h, markRaw } from "vue"

/**
 * A rich text component rendering a `tag` with the attributes returned by `attrs`, around the
 * node's children.
 */
export function richTextComponent(
	tag: string,
	attrs: (node: RTAnyNode) => Record<string, unknown> = () => ({ "data-bar": "true" }),
): Component {
	return markRaw(
		defineComponent({
			props: getRichTextComponentProps(),
			setup(props, { slots }) {
				return () => h(tag, attrs(props.node), slots.default?.())
			},
		}),
	)
}
