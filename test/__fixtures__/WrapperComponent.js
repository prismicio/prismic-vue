/**
 * Creates a new component.
 */
export const createWrapperComponent = (suffix = "", props = {}) => ({
	name: `WrapperComponent${suffix}`,
	functional: true,
	props,
	render(h, { data, children }) {
		return h(
			"div",
			{
				...data,
				class: [data.class, `wrapperComponent${suffix}`],
			},
			children,
		);
	},
});

export const WrapperComponent = createWrapperComponent();
