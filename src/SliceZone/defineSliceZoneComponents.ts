import { markRaw } from "vue"

import type {
	SliceComponentType,
	SliceLike,
	SliceZoneComponents,
} from "./types"

/**
 * Gets an optimized record of Slice types mapped to Vue components. Each
 * components will be rendered for each instance of their Slice type.
 *
 * @remarks
 * This is essentially an helper function to ensure {@link markRaw} is correctly
 * applied on each components, improving performances.
 *
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
	const result = {} as SliceZoneComponents<TSlice, TContext>

	let type: keyof typeof components
	for (type in components) {
		const component = components[type]
		result[type] =
			typeof component === "string"
				? component
				: markRaw(
						component as SliceComponentType<
							Extract<TSlice, SliceLike<typeof type>>,
							TContext
						>,
					)
	}

	return result
}
