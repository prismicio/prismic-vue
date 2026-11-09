import { getSliceComponentProps } from "@prismicio/vue"
import { type Component, defineComponent, h } from "vue"

/** A slice component that renders its props as JSON. */
export function propsSlice(testId: string): Component {
	return defineComponent({
		props: getSliceComponentProps(),
		setup(props) {
			return () => h("div", { "data-testid": testId }, JSON.stringify(props))
		},
	})
}

/** A slice component for `mapSliceZone()` results that renders its attributes as JSON. */
export function mappedSlice(testId: string): Component {
	return defineComponent({
		inheritAttrs: false,
		setup(_, { attrs }) {
			return () => h("div", { "data-testid": testId }, JSON.stringify(attrs))
		},
	})
}

/** A slice component registered globally, so it can be referenced by name. */
export const GlobalSlice: Component = defineComponent({
	props: getSliceComponentProps(),
	setup(props) {
		return () => h("div", { "data-testid": "global" }, props.slice.slice_type)
	},
})
