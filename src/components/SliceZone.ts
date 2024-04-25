import { Slice } from "@prismicio/client";
import {
	AllowedComponentProps,
	ComponentCustomProps,
	ConcreteComponent,
	DefineComponent,
	FunctionalComponent,
	PropType,
	Raw,
	VNodeProps,
	computed,
	defineAsyncComponent,
	defineComponent,
	h,
	markRaw,
	watchEffect,
} from "vue";

import { __PRODUCTION__ } from "../lib/__PRODUCTION__";
import { simplyResolveComponent } from "../lib/simplyResolveComponent";

import { usePrismic } from "../usePrismic";

/**
 * Returns the type of a `SliceLike` type.
 *
 * @typeParam TSlice - The Slice from which the type will be extracted.
 */
type ExtractSliceType<TSlice extends SliceLike> = TSlice extends SliceLikeRestV2
	? TSlice["slice_type"]
	: TSlice extends SliceLikeGraphQL
	? TSlice["type"]
	: never;

/**
 * The minimum required properties to represent a Prismic Slice from the Prismic
 * Rest API V2 for the `<SliceZone>` component.
 *
 * If using Prismic's Rest API V2, use the `Slice` export from
 * `@prismicio/client` for a full interface.
 *
 * @typeParam TSliceType - Type name of the Slice.
 */
export type SliceLikeRestV2<TSliceType extends string = string> = Pick<
	Slice<TSliceType>,
	"id" | "slice_type"
>;

/**
 * The minimum required properties to represent a Prismic Slice from the Prismic
 * GraphQL API for the `<SliceZone>` component.
 *
 * @typeParam TSliceType - Type name of the Slice.
 */
export type SliceLikeGraphQL<TSliceType extends string = string> = {
	type: Slice<TSliceType>["slice_type"];
};

/**
 * The minimum required properties to represent a Prismic Slice for the
 * `<SliceZone />` component.
 *
 * If using Prismic's Rest API V2, use the `Slice` export from
 * `@prismicio/client` for a full interface.
 *
 * @typeParam TSliceType - Type name of the Slice
 */
export type SliceLike<TSliceType extends string = string> = (
	| SliceLikeRestV2<TSliceType>
	| SliceLikeGraphQL<TSliceType>
) & {
	/**
	 * If `true`, this Slice has been modified from its original value using a
	 * mapper and `@prismicio/client`'s `mapSliceZone()`.
	 *
	 * @internal
	 */
	__mapped?: true;
};

/**
 * A looser version of the `SliceZone` type from `@prismicio/client` using
 * `SliceLike`.
 *
 * If using Prismic's REST API, use the `SliceZone` export from
 * `@prismicio/client` for the full type.
 *
 * @typeParam TSlice - The type(s) of slices in the Slice Zone
 */
export type SliceZoneLike<TSlice extends SliceLike = SliceLike> =
	readonly TSlice[];

/**
 * Vue props for a component rendering content from a Prismic Slice using the
 * `<SliceZone />` component.
 *
 * @typeParam TSlice - The type(s) of slices in the Slice Zone
 * @typeParam TContext - Arbitrary data passed to `<SliceZone />` and made
 *   available to all Slice components
 */
export type SliceComponentProps<
	TSlice extends SliceLike = SliceLike,
	TContext = unknown,
> = {
	/**
	 * Slice data for this component.
	 */
	slice: TSlice;

	/**
	 * The index of the Slice in the Slice Zone.
	 */
	index: number;

	/**
	 * All Slices from the Slice Zone to which the Slice belongs.
	 */
	// TODO: We have to keep this list of Slices general due to circular
	// reference limtiations. If we had another generic to determine the full
	// union of Slice types, it would include TSlice. This causes TypeScript to
	// throw a compilation error.
	slices: SliceZoneLike<
		TSlice extends SliceLikeGraphQL ? SliceLikeGraphQL : SliceLikeRestV2
	>;

	/**
	 * Arbitrary data passed to `<SliceZone />` and made available to all Slice
	 * components.
	 */
	context: TContext;
};

/**
 * Native Vue props for a component rendering content from a Prismic Slice using
 * the `<SliceZone />` component.
 *
 * @typeParam TSlice - The Slice type
 * @typeParam TContext - Arbitrary data passed to `<SliceZone />` and made
 *   available to all Slice components
 */
export type DefineComponentSliceComponentProps<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	TSlice extends SliceLike = any,
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
 * Gets native Vue props for a component rendering content from a Prismic Slice
 * using the `<SliceZone />` component.
 *
 * Props are: `["slice", "index", "slices", "context"]`
 *
 * @example
 *
 * ```javascript
 * // Defining a new slice component
 * import { getSliceComponentProps } from "@prismicio/vue";
 *
 * export default {
 * 	props: getSliceComponentProps(),
 * };
 * ```
 *
 * @example
 *
 * ```javascript
 * // Defining a new slice component with visual hint
 * import { getSliceComponentProps } from "@prismicio/vue";
 *
 * export default {
 * 	props: getSliceComponentProps(["slice", "index", "slices", "context"]),
 * };
 * ```
 *
 * @typeParam TSlice - The Slice type
 * @typeParam TContext - Arbitrary data passed to `<SliceZone />` and made
 *   available to all Slice components
 * @param propsHint - An optional array of prop names used for the sole purpose
 *   of having a visual hint of which props are made available to the slice,
 *   this parameters doesn't have any effect
 *
 * @returns Props object to use with {@link defineComponent}
 */
export const getSliceComponentProps = <
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	TSlice extends SliceLike = any,
	TContext = unknown,
>(
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	propsHint?: ["slice", "index", "slices", "context"],
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
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	TSlice extends SliceLike = any,
	TContext = unknown,
> =
	// For reference within TypeScript files when `*.vue` type cannot be inferred
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
	| DefineComponent<{}, {}, any>
	// Likewise, for reference with TypeScript files.
	| ReturnType<typeof defineAsyncComponent>
	| DefineComponent<SliceComponentProps<TSlice, TContext>>
	| FunctionalComponent<SliceComponentProps<TSlice, TContext>>;

/**
 * This Slice component can be used as a reminder to provide a proper
 * implementation.
 *
 * This is also the default Vue component rendered when a component mapping
 * cannot be found in `<SliceZone />`.
 */
export const TODOSliceComponent = __PRODUCTION__
	? ((() => null) as FunctionalComponent<{
			slice: SliceLike;
	  }>)
	: /*#__PURE__*/ (defineComponent({
			name: "TODOSliceComponent",
			props: {
				slice: {
					type: Object as PropType<SliceLike>,
					required: true,
				},
			},
			setup(props) {
				const type = computed(() => {
					return "slice_type" in props.slice
						? props.slice.slice_type
						: props.slice.type;
				});

				watchEffect(() => {
					console.warn(
						`[SliceZone] Could not find a component for Slice type "${type.value}"`,
						props.slice,
					);
				});

				return () => {
					return h(
						"section",
						{
							"data-slice-zone-todo-component": "",
							"data-slice-type": type.value,
						},
						[`Could not find a component for Slice type "${type.value}"`],
					);
				};
			},
	  }) as SliceComponentType);

/**
 * A record of Slice types mapped to Vue components. Each components will be
 * rendered for each instance of their Slice type.
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
		[SliceType in ExtractSliceType<TSlice>]:
			| SliceComponentType<Extract<TSlice, SliceLike<SliceType>>, TContext>
			| string;
	};

/**
 * Gets an optimized record of Slice types mapped to Vue components. Each
 * components will be rendered for each instance of their Slice type.
 *
 * @remarks
 * This is essentially an helper function to ensure {@link markRaw} is correctly
 * applied on each components, improving performances.
 * @example
 *
 * ```javascript
 * // Defining a slice components
 * import { defineSliceZoneComponents } from "@prismicio/vue";
 *
 * export default {
 *   data() {
 *     components: defineSliceZoneComponents({
 *       foo: Foo,
 *       bar: defineAsyncComponent(
 *         () => new Promise((res) => res(Bar)),
 *       ),
 *       baz: "Baz",
 *     }),
 *   }
 * };
 * ```
 *
 * @typeParam TSlice - The type(s) of slices in the Slice Zone
 * @typeParam TContext - Arbitrary data made available to all Slice components
 *
 * @param components - {@link SliceZoneComponents}
 *
 * @returns A new optimized record of {@link SliceZoneComponents}
 */
export const defineSliceZoneComponents = <
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	TSlice extends SliceLike = any,
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
 * Arguments for a `<SliceZone>` `resolver` function.
 */
export type SliceZoneResolverArgs<TSlice extends SliceLike = SliceLike> = {
	/**
	 * The Slice to resolve to a Vue component..
	 */
	slice: TSlice;

	/**
	 * The name of the Slice.
	 */
	sliceName: ExtractSliceType<TSlice>;

	/**
	 * The index of the Slice in the Slice Zone.
	 */
	i: number;
};

/**
 * A function that determines the rendered Vue component for each Slice in the
 * Slice Zone. If a nullish value is returned, the component will fallback to
 * the `components` or `defaultComponent` props to determine the rendered
 * component.
 *
 * @deprecated Use the `components` prop instead.
 *
 * @param args - Arguments for the resolver function.
 *
 * @returns The Vue component to render for a Slice.
 */
export type SliceZoneResolver<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	TSlice extends SliceLike = any,
	TContext = unknown,
> = (
	args: SliceZoneResolverArgs<TSlice>,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
) => SliceComponentType<any, TContext> | string | undefined | null;

/**
 * Props for `<SliceZone />`.
 *
 * @typeParam TContext - Arbitrary data made available to all Slice components
 */
export type SliceZoneProps<TContext = unknown> = {
	/**
	 * List of Slice data from the Slice Zone.
	 */
	slices: SliceZoneLike;

	/**
	 * A record mapping Slice types to Vue components.
	 */
	components?: SliceZoneComponents;

	/**
	 * A function that determines the rendered Vue component for each Slice in the
	 * Slice Zone.
	 *
	 * @deprecated Use the `components` prop instead.
	 *
	 * @param args - Arguments for the resolver function.
	 *
	 * @returns The Vue component to render for a Slice.
	 */
	// TODO: Remove in v5 when the `resolver` prop is removed.
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	resolver?: SliceZoneResolver<any, TContext>;

	/**
	 * Arbitrary data made available to all Slice components.
	 */
	context?: TContext;

	/**
	 * A component or a functional component rendered if a component mapping from
	 * the `components` prop cannot be found.
	 *
	 * @remarks
	 * Components will be rendered using the {@link SliceComponentProps} interface.
	 *
	 * @defaultValue The Slice Zone default component provided to `@prismicio/vue` plugin if configured, otherwise `null` when `process.env.NODE_ENV === "production"` else {@link TODOSliceComponent}.
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	defaultComponent?: SliceComponentType<any, TContext>;

	/**
	 * An HTML tag name, a component, or a functional component used to wrap the
	 * output. The Slice Zone is not wrapped by default.
	 */
	wrapper?: string | ConcreteComponent | Raw<DefineComponent>;
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
			type: Array as PropType<
				SliceZoneLike<SliceLike & Record<string, unknown>>
			>,
			required: true,
		},
		components: {
			type: Object as PropType<SliceZoneComponents>,
			default: undefined,
			required: false,
		},
		resolver: {
			type: Function as PropType<SliceZoneResolver>,
			default: undefined,
			required: false,
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
			type: [String, Object, Function] as PropType<
				string | ConcreteComponent | Raw<DefineComponent>
			>,
			default: undefined,
			required: false,
		},
	},
	setup(props) {
		// Prevent fatal if user didn't check for field, throws `Invalid prop` warn
		if (!props.slices) {
			return () => null;
		}

		// TODO: Remove in v3 when the `resolver` prop is removed.
		if (!__PRODUCTION__) {
			if (props.resolver) {
				console.warn(
					"The `resolver` prop is deprecated. Please replace it with a components map using the `components` prop.",
				);
			}
		}

		const { options } = usePrismic();

		const renderedSlices = computed(() => {
			return props.slices.map((slice, index) => {
				const type =
					"slice_type" in slice ? (slice.slice_type as string) : slice.type;

				let component =
					props.components && type in props.components
						? props.components[type]
						: props.defaultComponent ||
						  options.components?.sliceZoneDefaultComponent;

				// TODO: Remove `resolver` in v5 in favor of `components`.
				if (props.resolver) {
					const resolvedComponent = props.resolver({
						slice,
						sliceName: type,
						i: index,
					});

					if (resolvedComponent) {
						component = resolvedComponent;
					}
				}

				const key =
					"id" in slice && typeof slice.id === "string"
						? slice.id
						: `${index}-${JSON.stringify(slice)}`;

				if (component) {
					if (slice.__mapped) {
						const { __mapped, ...mappedProps } = slice;

						return h(simplyResolveComponent(component as ConcreteComponent), {
							key,
							...mappedProps,
						});
					}

					return h(simplyResolveComponent(component as ConcreteComponent), {
						key,
						slice,
						index,
						context: props.context,
						slices: props.slices,
					});
				} else {
					return h(
						simplyResolveComponent(TODOSliceComponent as ConcreteComponent),
						{ key, slice },
					);
				}
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
