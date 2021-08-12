import { DefineComponent, defineComponent, h } from "vue";

export const createWrapperComponent = (
	suffix: string | number = "",
): DefineComponent =>
	defineComponent({
		name: `WrapperComponent${suffix}`,
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
