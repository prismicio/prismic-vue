import { getTableComponentProps } from "@prismicio/vue"
import { type Component, defineComponent, h, markRaw } from "vue"

/** A table component rendering a `div` with the given class around its children. */
export function tableComponent(
	type: keyof typeof getTableComponentProps,
	className: string,
): Component {
	return markRaw(
		defineComponent({
			props: getTableComponentProps[type](),
			setup(_, { slots }) {
				return () => h("div", { class: className }, slots.default?.())
			},
		}),
	)
}
