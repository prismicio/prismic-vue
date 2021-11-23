// We need to polyfill process if it doesn't exist, such as in the browser.
if (typeof process === "undefined") {
	globalThis.process = { env: {} };
}

/**
 * `true` if in the production environment, `false` otherwise.
 *
 * This boolean can be used to perform actions only in development environments,
 * such as logging.
 */
const __PRODUCTION__ = process.env.NODE_ENV === "production";

export const getSliceComponentProps = (propsHint) => ({
	slice: {
		type: Object,
		required: true,
	},
	index: {
		type: Number,
		required: true,
	},
	slices: {
		type: Array,
		required: true,
	},
	context: {
		type: null,
		required: true,
	},
});

export const TODOSliceComponent = __PRODUCTION__
	? () => null
	: {
			name: "TODOSliceCOmponent",
			functional: true,
			props: getSliceComponentProps(),
			renfer(h, { props, data, children, parent }) {
				console.warn(
					`[SliceZone] Could not find a component for Slice type "${props.slice.slice_type}"`,
					props.slice
				);

				return () => {
					return h(
						"section",
						{
							...data,
							"data-slice-zone-todo-component": "",
							"data-slice-type": props.slice.slice_type,
						},
						[
							`Could not find a component for Slice type "${props.slice.slice_type}"`,
						]
					);
				};
			},
	  };

// Just mimiced to prevent confusion but doesn't provide any value with version 2 of this kit
export const defineSliceZoneComponents = (components) => components;

export const SliceZone = {
	name: "SliceZone",
	functional: true,
	props: {
		slices: {
			type: Array,
			required: true,
		},
		components: {
			type: Object,
			default: undefined,
			required: false,
		},
		resolver: {
			type: Function,
			default: undefined,
			required: false,
		},
		context: {
			type: null,
			default: undefined,
			required: false,
		},
		defaultComponent: {
			type: Object,
			default: undefined,
			required: false,
		},
		wrapper: {
			type: [String, Object, Function],
			default: "div",
			required: false,
		},
	},
	render(h, { props, data, children, parent }) {
		// Prevent fatal if user didn't check for field, throws `Invalid prop` warn
		if (!props.slices) {
			return () => null;
		}

		const renderedSlices = computed(() => {
			return props.slices.map((slice, index) => {
				let component =
					props.components && slice.slice_type in props.components
						? props.components[slice.slice_type]
						: props.defaultComponent || TODOSliceComponent;

				// TODO: Remove `resolver` in v3 in favor of `components`.
				if (props.resolver) {
					const resolvedComponent = props.resolver({
						slice,
						sliceName: slice.slice_type,
						i: index,
					});

					if (resolvedComponent) {
						component = resolvedComponent;
					}
				}

				const p = {
					key: `${slice.slice_type}-${index}`,
					slice,
					index,
					context: props.context,
					slices: props.slices,
				};

				return h(component, p);
			});
		});

		const parent = props.wrapper;

		if (typeof parent === "string") {
			return h(parent, data, renderedSlices.value);
		} else {
			return h(parent, data, { default: () => renderedSlices.value });
		}
	},
};
