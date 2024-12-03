import type { ComponentPropsOptions, DefineComponent } from "vue"
import { defineComponent, h } from "vue"

/**
 * Creates a new component.
 */
export const createWrapperComponent = <T = DefineComponent>(
	suffix: string | number = "",
	props: ComponentPropsOptions = {},
): T =>
	defineComponent({
		name: `WrapperComponent${suffix}`,
		props,
		setup(_props, { slots }) {
			return () => {
				return h(
					"div",
					{
						class: `wrapperComponent${suffix}`,
					},
					slots.default && slots.default(),
				)
			}
		},
	}) as unknown as T

export const WrapperComponent = createWrapperComponent()
