import {
	AllowedComponentProps,
	ComponentCustomProps,
	computed,
	ConcreteComponent,
	DefineComponent,
	defineComponent,
	FunctionalComponent,
	h,
	markRaw,
	PropType,
	VNodeProps,
	watchEffect,
} from "vue";

import { Slice } from "@prismicio/types";

import { simplyResolveComponent } from "../lib/simplyResolveComponent";
import { __PRODUCTION__ } from "../lib/__PRODUCTION__";
import { usePrismic } from "../usePrismic";

/**
 * The minimum required properties to represent a Prismic Slice for the `<SliceZone />` component.
 *
 * If using Prismic's REST API, use the `Slice` export from `@prismicio/types` for a full interface.
 *
 * @typeParam TSliceType - Type name of the Slice
 */
export type SliceLike<TSliceType extends string = string> = Pick<
	Slice<TSliceType>,
	"slice_type"
>;

/**
 * A looser version of the `SliceZone` type from `@prismicio/types` using `SliceLike`.
 *
 * If using Prismic's REST API, use the `SliceZone` export from `@prismicio/types` for the full type.
 *
 * @typeParam TSlice - The type(s) of slices in the Slice Zone
 */
export type SliceZoneLike<TSlice extends SliceLike> = readonly TSlice[];

/**
 * Vue props for a component rendering content from a Prismic Slice using the `<SliceZone />` component.
 *
 * @typeParam TSlice - The type(s) of slices in the Slice Zone
 * @typeParam TContext - Arbitrary data passed to `<SliceZone />` and made available to all Slice components
 */
export type SliceComponentProps<
	TSlice extends SliceLike = SliceLike,
	TContext = unknown,
> = {
	/** Slice data for this component. */
	slice: TSlice;

	/** The index of the Slice in the Slice Zone. */
	index: number;

	/** All Slices from the Slice Zone to which the Slice belongs. */
	// TODO: We have to keep this list of Slices general due to circular
	// reference limtiations. If we had another generic to determine the full
	// union of Slice types, it would include TSlice. This causes TypeScript to
	// throw a compilation error.
	slices: SliceZoneLike<SliceLike>;

	/** Arbitrary data passed to `<SliceZone />` and made available to all Slice components. */
	context: TContext;
};

/**
 * Native Vue props for a component rendering content from a Prismic Slice using the `<SliceZone />` component.
 *
 * @typeParam TSlice - The type(s) of slices in the Slice Zone
 * @typeParam TContext - Arbitrary data passed to `<SliceZone />` and made available to all Slice components
 */
export type DefineComponentSliceComponentProps<
	TSlice extends SliceLike = SliceLike,
	TContext = unknown,
> = {
	slice: {
		type: PropType<SliceComponentProps<TSlice, TContext>["slice"]>;
		required: true;
	};
	index: {
		type: PropType<SliceComponentProps<TSlice, TContext>["index"]>;
		required: true;
	};
	slices: {
		type: PropType<SliceComponentProps<TSlice, TContext>["slices"]>;
		required: true;
	};
	context: {
		type: PropType<SliceComponentProps<TSlice, TContext>["context"]>;
		required: true;
	};
};

/**
 * Gets native Vue props for a component rendering content from a Prismic Slice using the `<SliceZone />` component. Props are: `["slice", "index", "slices", "context"]`
 *
 * @param propsHint - An optional array of prop names used for the sole purpose of having a visual hint of which props are made available to the slice, this parameters doesn't have any effect
 *
 * @returns Props object to use with {@link defineComponent}
 *
 * @typeParam TSlice - The type(s) of slices in the Slice Zone
 * @typeParam TContext - Arbitrary data passed to `<SliceZone />` and made available to all Slice components
 *
 * @example
 * Defining a new slice component:
 *
 * ```
 * import { getSliceComponentProps } from "@prismicio/vue";
 *
 * export default {
 *   props: getSliceComponentProps(),
 * };
 * ```
 *
 * @example
 * Defining a new slice component with visual hint:
 *
 * ```
 * import { getSliceComponentProps } from "@prismicio/vue";
 *
 * export default {
 *   props: getSliceComponentProps(["slice", "index", "slices", "context"]),
 * };
 * ```
 */
export const getSliceComponentProps = <
	TSlice extends SliceLike = SliceLike,
	TContext = unknown,
>(
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	propsHint?: string[],
): DefineComponentSliceComponentProps<TSlice, TContext> => ({
	slice: {
		type: Object as PropType<SliceComponentProps<TSlice, TContext>["slice"]>,
		required: true,
	},
	index: {
		type: Number as PropType<SliceComponentProps<TSlice, TContext>["index"]>,
		required: true,
	},
	slices: {
		type: Array as PropType<SliceComponentProps<TSlice, TContext>["slices"]>,
		required: true,
	},
	context: {
		type: null as unknown as PropType<
			SliceComponentProps<TSlice, TContext>["context"]
		>,
		required: true,
	},
});

/**
 * A Vue component to be rendered for each instance of its Slice.
 *
 * @typeParam TSlice - The type(s) of slices in the Slice Zone
 * @typeParam TContext - Arbitrary data made available to all Slice components
 */
export type SliceComponentType<
	TSlice extends SliceLike = SliceLike,
	TContext = unknown,
> =
	| DefineComponent<SliceComponentProps<TSlice, TContext>>
	| FunctionalComponent<SliceComponentProps<TSlice, TContext>>;

/**
 * This Slice component can be used as a reminder to provide a proper implementation.
 *
 * This is also the default Vue component rendered when a component mapping cannot be found in `<SliceZone />`.
 */
export const TODOSliceComponent = __PRODUCTION__
	? ((() => null) as FunctionalComponent<SliceComponentProps>)
	: /*#__PURE__*/ (defineComponent({
			name: "TODOSliceCOmponent",
			props: getSliceComponentProps(),
			setup(props) {
				watchEffect(() => {
					console.warn(
						`[SliceZone] Could not find a component for Slice type "${props.slice.slice_type}"`,
						props.slice,
					);
				});

				return () => {
					return h(
						"section",
						{
							"data-slice-zone-todo-component": "",
							"data-slice-type": props.slice.slice_type,
						},
						[
							`Could not find a component for Slice type "${props.slice.slice_type}"`,
						],
					);
				};
			},
	  }) as SliceComponentType);

/**
 * A record of Slice types mapped to Vue components. Each components will be rendered for each instance of their Slice type.
 *
 * @typeParam TSlice - The type(s) of slices in the Slice Zone
 * @typeParam TContext - Arbitrary data made available to all Slice components
 */
export type SliceZoneComponents<
	TSlice extends SliceLike = SliceLike,
	TContext = unknown,
> =
	// This is purposely not wrapped in Partial to ensure a component is provided
	// for all Slice types. <SliceZone /> will render a default component if one is
	// not provided, but it *should* be a type error if an explicit component is
	// missing.
	//
	// If a developer purposely does not want to provide a component, they can
	// assign it to the TODOSliceComponent exported from this package. This
	// signals to future developers that it is a placeholder and should be
	// implemented.
	{
		[SliceType in keyof Record<TSlice["slice_type"], never>]:
			| SliceComponentType<Extract<TSlice, SliceLike<SliceType>>, TContext>
			| string;
	};

/**
 * Gets an optimized record of Slice types mapped to Vue components. Each components will be rendered for each instance of their Slice type.
 *
 * @param components - {@link SliceZoneComponents}
 *
 * @returns A new optimized record of {@link SliceZoneComponents}
 *
 * @typeParam TSlice - The type(s) of slices in the Slice Zone
 * @typeParam TContext - Arbitrary data made available to all Slice components
 *
 * @remarks This is essentially an helper function to ensure {@link markRaw} is correctly applied on each components, improving performances.
 *
 * @example
 * Defining a slice components:
 *
 * ```
 * import { getSliceZoneComponents } from "@prismicio/vue";
 *
 * export default {
 *   data() {
 *     components: getSliceZoneComponents({
 *       foo: Foo,
 *       bar: defineAsyncComponent(
 *         () => new Promise((res) => res(Bar)),
 *       ),
 *       baz: "Baz",
 *     }),
 *   }
 * };
 * ```
 */
export const getSliceZoneComponents = <
	TSlice extends SliceLike = SliceLike,
	TContext = unknown,
>(
	components: SliceZoneComponents<TSlice, TContext>,
): SliceZoneComponents<TSlice, TContext> => {
	const result = {} as SliceZoneComponents<TSlice, TContext>;

	let type: keyof typeof components;
	for (type in components) {
		const component = components[type];
		result[type] =
			typeof component === "string"
				? component
				: markRaw(
						component as SliceComponentType<
							Extract<TSlice, SliceLike<typeof type>>,
							TContext
						>,
				  );
	}

	return result;
};

/**
 * Props for `<SliceZone />`.
 *
 * @typeParam TSlice - The type(s) of slices in the Slice Zone
 * @typeParam TContext - Arbitrary data made available to all Slice components
 */
export type SliceZoneProps<
	TSlice extends SliceLike = SliceLike,
	TContext = unknown,
> = {
	/** List of Slice data from the Slice Zone. */
	slices: SliceZoneLike<TSlice>;

	/** A record mapping Slice types to Vue components. */
	components: SliceZoneComponents;

	/** Arbitrary data made available to all Slice components. */
	context?: TContext;

	/**
	 * A component or a functional component rendered if a component mapping from the `components` prop cannot be found.
	 *
	 * @remarks Components will be rendered using the {@link SliceComponentProps} interface.
	 *
	 * @defaultValue The Slice Zone default component provided to `@prismicio/vue` plugin if configured, otherwise `null` when `process.env.NODE_ENV === "production"` else {@link TODOSliceComponent}.
	 */
	defaultComponent?: SliceComponentType<TSlice, TContext>;

	/**
	 * An HTML tag name, a component, or a functional component used to wrap the output. The Slice Zone is not wrapped by default.
	 */
	wrapper?: string | ConcreteComponent;
};

/**
 * `<SliceZone />` implementation.
 *
 * @internal
 */
export const SliceZoneImpl = /*#__PURE__*/ defineComponent({
	name: "SliceZone",
	props: {
		slices: {
			type: Array as PropType<SliceZoneLike<SliceLike>>,
			required: true,
		},
		components: {
			type: Object as PropType<SliceZoneComponents>,
			required: true,
		},
		context: {
			type: null,
			default: undefined,
			required: false,
		},
		defaultComponent: {
			type: Object as PropType<SliceComponentType>,
			default: undefined,
			required: false,
		},
		wrapper: {
			type: [String, Object, Function] as PropType<string | ConcreteComponent>,
			default: undefined,
			required: false,
		},
	},
	setup(props) {
		// Prevent fatal if user didn't check for field, throws `Invalid prop` warn
		if (!props.slices) {
			return () => null;
		}

		const { options } = usePrismic();

		const renderedSlices = computed(() => {
			return props.slices.map((slice, index) => {
				const component =
					slice.slice_type in props.components
						? props.components[slice.slice_type]
						: props.defaultComponent ||
						  options.components?.sliceZoneDefaultComponent ||
						  TODOSliceComponent;

				const p = {
					slice,
					index,
					context: props.context,
					slices: props.slices,
				};

				return h(simplyResolveComponent(component as ConcreteComponent), p);
			});
		});

		return () => {
			if (props.wrapper) {
				const parent = simplyResolveComponent(props.wrapper);

				if (typeof parent === "string") {
					return h(parent, null, renderedSlices.value);
				} else {
					return h(parent, null, { default: () => renderedSlices.value });
				}
			} else {
				return renderedSlices.value;
			}
		};
	},
});

// export the public type for h/tsx inference
// also to avoid inline import() in generated d.ts files
/**
 * Component to render a Prismic Slice Zone.
 *
 * @see Component props {@link SliceZoneProps}
 * @see Templating Slice Zones {@link https://prismic.io/docs/technologies/vue-template-content#slices-and-groups}
 */
export const SliceZone = SliceZoneImpl as unknown as {
	new (): {
		$props: AllowedComponentProps &
			ComponentCustomProps &
			VNodeProps &
			SliceZoneProps;
	};
};
