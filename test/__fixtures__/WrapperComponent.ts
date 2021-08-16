import {
	ComponentPropsOptions,
	DefineComponent,
	defineComponent,
	h,
} from "vue";

/**
 * Creates a new component.
 */
export const createWrapperComponent = (
	suffix: string | number = "",
	props: ComponentPropsOptions = {},
): DefineComponent =>
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
				);
			};
		},
	});

export const WrapperComponent = createWrapperComponent();
