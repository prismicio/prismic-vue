import type { RTAnyNode, RichTextNodeType } from "@prismicio/client"
import type {
	DefineComponent,
	FunctionalComponent,
	defineAsyncComponent,
} from "vue"

/**
 * A map of Rich Text block types to Vue Components. It is used to render Rich
 * Text or title fields.
 *
 * @see Templating Rich Text and title fields from Prismic {@link https://prismic.io/docs/rich-text}
 */
export type VueRichTextSerializer = Partial<
	Record<keyof typeof RichTextNodeType, VueRichTextComponent>
>

/**
 * Props for a component rendering nodes from a Prismic rich text field.
 */
export type RichTextComponentProps<TRTNode extends RTAnyNode = RTAnyNode> = {
	node: TRTNode
}

/**
 * A Vue component rendering a node from a Prismic rich text field.
 *
 * @typeParam TRTNode - The type of rich text node(s) this component handles
 */
type VueRichTextComponent<TRTNode extends RTAnyNode = RTAnyNode> =
	// For reference within TypeScript files when `*.vue` type cannot be inferred
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-explicit-any
	| DefineComponent<{}, {}, any>
	// Likewise, for reference with TypeScript files.
	| ReturnType<typeof defineAsyncComponent>
	| DefineComponent<RichTextComponentProps<TRTNode>>
	| FunctionalComponent<RichTextComponentProps<TRTNode>>
