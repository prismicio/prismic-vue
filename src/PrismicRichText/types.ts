import type {
	LinkResolverFunction,
	RTAnyNode,
	RTEmNode,
	RTEmbedNode,
	RTHeading1Node,
	RTHeading2Node,
	RTHeading3Node,
	RTHeading4Node,
	RTHeading5Node,
	RTHeading6Node,
	RTImageNode,
	RTLabelNode,
	RTLinkNode,
	RTListItemNode,
	RTListNode,
	RTOListItemNode,
	RTOListNode,
	RTParagraphNode,
	RTPreformattedNode,
	RTSpanNode,
	RTStrongNode,
	RichTextNodeTypes,
} from "@prismicio/client"

import type { Component, ComponentShorthand } from "../types"

/**
 * A map of Rich Text block types to Vue Components. It is used to render Rich
 * Text or title fields.
 *
 * @see Templating Rich Text and title fields from Prismic {@link https://prismic.io/docs/rich-text}
 */
export type RichTextComponents = {
	heading1?: RichTextComponent<RTHeading1Node> | ComponentShorthand
	heading2?: RichTextComponent<RTHeading2Node> | ComponentShorthand
	heading3?: RichTextComponent<RTHeading3Node> | ComponentShorthand
	heading4?: RichTextComponent<RTHeading4Node> | ComponentShorthand
	heading5?: RichTextComponent<RTHeading5Node> | ComponentShorthand
	heading6?: RichTextComponent<RTHeading6Node> | ComponentShorthand
	paragraph?: RichTextComponent<RTParagraphNode> | ComponentShorthand
	preformatted?:
		| RichTextComponent<RTPreformattedNode>
		| ComponentShorthand
	strong?: RichTextComponent<RTStrongNode> | ComponentShorthand
	em?: RichTextComponent<RTEmNode> | ComponentShorthand
	listItem?: RichTextComponent<RTListItemNode> | ComponentShorthand
	oListItem?: RichTextComponent<RTOListItemNode> | ComponentShorthand
	list?: RichTextComponent<RTListNode> | ComponentShorthand
	oList?: RichTextComponent<RTOListNode> | ComponentShorthand
	image?: RichTextComponent<RTImageNode> | Omit<ComponentShorthand, "as">
	embed?: RichTextComponent<RTEmbedNode> | ComponentShorthand
	hyperlink?:
		| RichTextComponent<RTLinkNode>
		| Omit<ComponentShorthand, "as">
	label?: RichTextComponent<RTLabelNode> | Omit<ComponentShorthand, "as">
	span?: RichTextComponent<RTSpanNode>
}

/** Props for a component rendering nodes from a Prismic rich text field. */
export type RichTextComponentProps<TRTNode extends RTAnyNode = RTAnyNode> = {
	node: TRTNode
}

/**
 * A Vue component rendering a node from a Prismic rich text field.
 *
 * @typeParam TRTNode - The type of rich text node(s) this component handles
 */
export type RichTextComponent<TRTNode extends RTAnyNode = RTAnyNode> =
	Component<RichTextComponentProps<TRTNode>>

export type InternalRichTextComponents = Record<
	RichTextNodeTypes,
	{
		is: RichTextComponent
		linkResolver?: LinkResolverFunction
		shorthand?: ComponentShorthand
	}
>
