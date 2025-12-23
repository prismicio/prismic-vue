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

import type { VueComponent, VueComponentShorthand } from "../types"

/**
 * A map of Rich Text block types to Vue Components. It is used to render Rich
 * Text or title fields.
 *
 * @see Templating Rich Text and title fields from Prismic {@link https://prismic.io/docs/rich-text}
 */
export type VueRichTextComponents = {
	heading1?: VueRichTextComponent<RTHeading1Node> | VueComponentShorthand
	heading2?: VueRichTextComponent<RTHeading2Node> | VueComponentShorthand
	heading3?: VueRichTextComponent<RTHeading3Node> | VueComponentShorthand
	heading4?: VueRichTextComponent<RTHeading4Node> | VueComponentShorthand
	heading5?: VueRichTextComponent<RTHeading5Node> | VueComponentShorthand
	heading6?: VueRichTextComponent<RTHeading6Node> | VueComponentShorthand
	paragraph?: VueRichTextComponent<RTParagraphNode> | VueComponentShorthand
	preformatted?:
		| VueRichTextComponent<RTPreformattedNode>
		| VueComponentShorthand
	strong?: VueRichTextComponent<RTStrongNode> | VueComponentShorthand
	em?: VueRichTextComponent<RTEmNode> | VueComponentShorthand
	listItem?: VueRichTextComponent<RTListItemNode> | VueComponentShorthand
	oListItem?: VueRichTextComponent<RTOListItemNode> | VueComponentShorthand
	list?: VueRichTextComponent<RTListNode> | VueComponentShorthand
	oList?: VueRichTextComponent<RTOListNode> | VueComponentShorthand
	image?: VueRichTextComponent<RTImageNode> | Omit<VueComponentShorthand, "as">
	embed?: VueRichTextComponent<RTEmbedNode> | VueComponentShorthand
	hyperlink?:
		| VueRichTextComponent<RTLinkNode>
		| Omit<VueComponentShorthand, "as">
	label?: VueRichTextComponent<RTLabelNode> | Omit<VueComponentShorthand, "as">
	span?: VueRichTextComponent<RTSpanNode>
}

/** Props for a component rendering nodes from a Prismic rich text field. */
export type VueRichTextComponentProps<TRTNode extends RTAnyNode = RTAnyNode> = {
	node: TRTNode
}

/**
 * A Vue component rendering a node from a Prismic rich text field.
 *
 * @typeParam TRTNode - The type of rich text node(s) this component handles
 */
export type VueRichTextComponent<TRTNode extends RTAnyNode = RTAnyNode> =
	VueComponent<VueRichTextComponentProps<TRTNode>>

export type InternalVueRichTextComponents = Record<
	RichTextNodeTypes,
	{
		is: VueRichTextComponent
		linkResolver?: LinkResolverFunction
		shorthand?: VueComponentShorthand
	}
>
