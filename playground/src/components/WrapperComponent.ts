import { defineComponent, h } from "vue"

export const WrapperComponent = defineComponent({
	name: "WrapperComponent",
	setup(_props, { slots }) {
		return () => {
			return h(
				"div",
				{
					class: "wrapperComponent",
				},
				slots.default && slots.default(),
			)
		}
	},
})
