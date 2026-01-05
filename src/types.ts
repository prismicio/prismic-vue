import type { Component as _Component } from "vue"

export type ComponentOrTagName = string | _Component

// For reference within TypeScript files when `*.vue` type cannot be inferred
export type Component<TProps> = _Component | _Component<TProps>

/**
 * A shorthand definition for `<PrismicRichText />` and `<PrismicTable />`
 * component types.
 */
export type ComponentShorthand = {
	/** The HTML element type rendered for this node type. */
	as?: string

	/** Other attributes to apply to the element type. */
	[Attribute: string]: string | boolean | null | undefined
}

export const isComponent = <T>(
	component: Component<T> | ComponentShorthand | undefined,
): component is Component<T> => {
	return (
		!!component &&
		(typeof component === "function" ||
			(typeof component === "object" &&
				(("render" in component && typeof component.render === "function") ||
					("setup" in component && typeof component.setup === "function") ||
					("__file" in component && !!component.__file) ||
					("__name" in component && !!component.__name) ||
					("props" in component && typeof component.props === "object"))))
	)
}
