import Vue from "vue";

/**
 * Creates a new component.
 */
export const createWrapperComponent = (suffix = "", props = {}) =>
	Vue.component({
		name: `WrapperComponent${suffix}`,
		functional: true,
		props,
		render(h, { data, children }) {
			return () => {
				return h(
					"div",
					{
						...data,
						class: `wrapperComponent${suffix}`,
					},
					children,
				);
			};
		},
	});

export const WrapperComponent = createWrapperComponent();
