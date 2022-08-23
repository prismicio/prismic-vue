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
	? null
	: {
			name: "TODOSliceComponent",
			functional: true,
			props: getSliceComponentProps(),
			render(h, { props, data }) {
				console.warn(
					`[SliceZone] Could not find a component for Slice type "${props.slice.slice_type}"`,
					props.slice
				);

				return h(
					"section",
					{
						...data,
						attrs: {
							...data.attrs,
							"data-slice-zone-todo-component": "",
							"data-slice-type": props.slice.slice_type
						},
					},
					[
						`Could not find a component for Slice type "${props.slice.slice_type}"`,
					]
				);
			},
	  };

// Just mimiced to prevent confusion but doesn't provide any value with version 2 of this kit
export const defineSliceZoneComponents = (components) => components;

export const SliceZone = {
	name: "SliceZone",
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
	computed:{
		renderedSlices() {
			if (!this.slices) {
				return null;
			}

			return this.slices.map((slice, index) => {
				let component =
					this.components && slice.slice_type in this.components
						? this.components[slice.slice_type]
						: this.defaultComponent || TODOSliceComponent;

				// TODO: Remove `resolver` in v3 in favor of `components`.
				if (this.resolver) {
					const resolvedComponent = this.resolver({
						slice,
						sliceName: slice.slice_type,
						i: index,
					});

					if (resolvedComponent) {
						component = resolvedComponent;
					}
				}

				const key = "id" in slice && slice.id
					? slice.id
					: `${index}-${JSON.stringify(slice)}`;

				const p = {
					key,
					props: {
						slice,
						index,
						context: this.context,
						slices: this.slices,
					}
				};

				return { component, p };
			});
		}
	},
	render(h) {
		// Prevent fatal if user didn't check for field, throws `Invalid prop` warn
		if (!this.slices) {
			return null;
		}

		return h(this.wrapper, this.renderedSlices.map(({ component, p }) => h(component, p)));
	},
};
