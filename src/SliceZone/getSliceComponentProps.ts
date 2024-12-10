import type { PropType } from "vue"

import type { SliceComponentProps, SliceLike } from "./types"

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
		type: PropType<SliceComponentProps<TSlice, TContext>["slice"]>
		required: true
	}
	index: {
		type: PropType<SliceComponentProps<TSlice, TContext>["index"]>
		required: true
	}
	slices: {
		type: PropType<SliceComponentProps<TSlice, TContext>["slices"]>
		required: true
	}
	context: {
		type: PropType<SliceComponentProps<TSlice, TContext>["context"]>
		required: true
	}
}

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
 * import { getSliceComponentProps } from "@prismicio/vue"
 *
 * export default {
 * 	props: getSliceComponentProps(),
 * }
 * ```
 *
 * @example
 *
 * ```javascript
 * // Defining a new slice component with visual hint
 * import { getSliceComponentProps } from "@prismicio/vue"
 *
 * export default {
 * 	props: getSliceComponentProps(["slice", "index", "slices", "context"]),
 * }
 * ```
 *
 * @typeParam TSlice - The Slice type
 * @typeParam TContext - Arbitrary data passed to `<SliceZone />` and made
 *   available to all Slice components
 *
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
})
