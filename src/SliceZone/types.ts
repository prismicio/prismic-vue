import type { Slice } from "@prismicio/client"

import type { VueComponent } from "../types"

/**
 * Returns the type of a `SliceLike` type.
 *
 * @typeParam TSlice - The Slice from which the type will be extracted.
 */
type ExtractSliceType<TSlice extends SliceLike> = TSlice extends SliceLikeRestV2
	? TSlice["slice_type"]
	: TSlice extends SliceLikeGraphQL
		? TSlice["type"]
		: never

/**
 * The minimum required properties to represent a Prismic Slice from the Prismic
 * Rest API V2 for the `unstable_mapSliceZone()` helper.
 *
 * @typeParam SliceType - Type name of the Slice.
 */
export type SliceLikeRestV2<TSliceType extends string = string> = Pick<
	Slice<TSliceType>,
	"id" | "slice_type"
>

/**
 * The minimum required properties to represent a Prismic Slice from the Prismic
 * GraphQL API for the `unstable_mapSliceZone()` helper.
 *
 * @typeParam SliceType - Type name of the Slice.
 */
export type SliceLikeGraphQL<TSliceType extends string = string> = {
	type: Slice<TSliceType>["slice_type"]
}

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
	__mapped?: true
}

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
	readonly TSlice[]

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
	/** Slice data for this component. */
	slice: TSlice

	/** The index of the Slice in the Slice Zone. */
	index: number

	/** All Slices from the Slice Zone to which the Slice belongs. */
	// TODO: We have to keep this list of Slices general due to circular
	// reference limtiations. If we had another generic to determine the full
	// union of Slice types, it would include TSlice. This causes TypeScript to
	// throw a compilation error.
	slices: SliceZoneLike<
		TSlice extends SliceLikeGraphQL ? SliceLikeGraphQL : SliceLikeRestV2
	>

	/**
	 * Arbitrary data passed to `<SliceZone />` and made available to all Slice
	 * components.
	 */
	context: TContext
}

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
> = VueComponent<SliceComponentProps<TSlice, TContext>>

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
			| SliceComponentType<
					Extract<TSlice, SliceLike<SliceType>> extends never
						? SliceLike
						: Extract<TSlice, SliceLike<SliceType>>,
					TContext
			  >
			// Global components
			| string
	}
