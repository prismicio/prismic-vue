import type {
	ConcreteComponent,
	DefineComponent,
	FunctionalComponent,
	Raw,
	defineAsyncComponent,
} from "vue"

export type ComponentOrTagName =
	| string
	| ConcreteComponent
	| Raw<DefineComponent>

export type VueComponent<TProps> =
	// For reference within TypeScript files when `*.vue` type cannot be inferred
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-explicit-any
	| DefineComponent<{}, {}, any>
	// Likewise, for reference with TypeScript files.
	| ReturnType<typeof defineAsyncComponent>
	| DefineComponent<TProps>
	| FunctionalComponent<TProps>

export const isVueComponent = <T>(
	component: VueComponent<T> | unknown,
): component is VueComponent<T> => {
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
