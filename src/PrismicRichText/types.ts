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
	heading1?: RichTextComponentProps<RTHeading1Node> | VueComponentShorthand
	heading2?: RichTextComponentProps<RTHeading2Node> | VueComponentShorthand
	heading3?: RichTextComponentProps<RTHeading3Node> | VueComponentShorthand
	heading4?: RichTextComponentProps<RTHeading4Node> | VueComponentShorthand
	heading5?: RichTextComponentProps<RTHeading5Node> | VueComponentShorthand
	heading6?: RichTextComponentProps<RTHeading6Node> | VueComponentShorthand
	paragraph?: RichTextComponentProps<RTParagraphNode> | VueComponentShorthand
	preformatted?:
		| RichTextComponentProps<RTPreformattedNode>
		| VueComponentShorthand
	strong?: RichTextComponentProps<RTStrongNode> | VueComponentShorthand
	em?: RichTextComponentProps<RTEmNode> | VueComponentShorthand
	listItem?: RichTextComponentProps<RTListItemNode> | VueComponentShorthand
	oListItem?: RichTextComponentProps<RTOListItemNode> | VueComponentShorthand
	list?: RichTextComponentProps<RTListNode> | VueComponentShorthand
	oList?: RichTextComponentProps<RTOListNode> | VueComponentShorthand
	image?:
		| RichTextComponentProps<RTImageNode>
		| Omit<VueComponentShorthand, "as">
	embed?: RichTextComponentProps<RTEmbedNode> | VueComponentShorthand
	hyperlink?:
		| RichTextComponentProps<RTLinkNode>
		| Omit<VueComponentShorthand, "as">
	label?:
		| RichTextComponentProps<RTLabelNode>
		| Omit<VueComponentShorthand, "as">
	span?: RichTextComponentProps<RTSpanNode>
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
export type VueRichTextComponent<TRTNode extends RTAnyNode = RTAnyNode> =
	VueComponent<RichTextComponentProps<TRTNode>>

export type InternalVueRichTextComponents = Record<
	RichTextNodeTypes,
	{
		is: VueRichTextComponent
		linkResolver?: LinkResolverFunction
		shorthand?: VueComponentShorthand
	}
>
