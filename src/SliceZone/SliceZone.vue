<script lang="ts" setup>
import { computed } from "vue"

import Wrapper from "../lib/Wrapper.vue"

import type { ComponentOrTagName } from "../types"
import type {
	SliceComponentType,
	SliceLike,
	SliceZoneComponents,
	SliceZoneLike,
} from "./types"

import { usePrismic } from "../usePrismic"

import { TODOSliceComponent } from "./TODOSliceComponent"

/**
 * Props for `<SliceZone />`.
 *
 * @typeParam TContext - Arbitrary data made available to all Slice components
 */
export type SliceZoneProps<TContext = unknown> = {
	/**
	 * List of Slice data from the Slice Zone.
	 */
	slices: SliceZoneLike<SliceLike & Record<string, unknown>>

	/**
	 * A record mapping Slice types to Vue components.
	 */
	components?: SliceZoneComponents

	/**
	 * The Vue component rendered if a component mapping from the `components`
	 * prop cannot be found.
	 *
	 * @remarks
	 * Components will be rendered using the {@link SliceComponentProps} interface.
	 *
	 * @defaultValue The Slice Zone default component provided to `@prismicio/vue` plugin if configured, otherwise `null` when `process.env.NODE_ENV === "production"` else {@link TODOSliceComponent}.
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	defaultComponent?: SliceComponentType<any, TContext>

	/**
	 * Arbitrary data made available to all Slice components.
	 */
	context?: TContext

	/**
	 * An HTML tag name or a component used to wrap the output. `<SliceZone />` is
	 * not wrapped by default.
	 *
	 * @defaultValue `"template"` (no wrapper)
	 */
	wrapper?: ComponentOrTagName
}

const props = defineProps<SliceZoneProps>()
defineOptions({ name: "SliceZone" })

const { options } = usePrismic()

const renderedSlices = computed(() => {
	return props.slices.map((slice, index) => {
		const type =
			"slice_type" in slice ? (slice.slice_type as string) : slice.type

		const key =
			"id" in slice && typeof slice.id === "string"
				? slice.id
				: `${index}-${JSON.stringify(slice)}`

		const is =
			props.components?.[type] ||
			props.defaultComponent ||
			options.components?.sliceZoneDefaultComponent

		if (!is) {
			return { is: TODOSliceComponent, key, props: { slice } }
		}

		if (slice.__mapped) {
			const { __mapped, ...mappedProps } = slice

			return { is, key, props: mappedProps }
		}

		return {
			is,
			key,
			props: {
				slice,
				index,
				context: props.context,
				slices: props.slices,
			},
		}
	})
})
</script>

<template>
	<Wrapper v-if="slices" :wrapper="wrapper">
		<Component
			v-for="renderedSlice in renderedSlices"
			:is="renderedSlice.is"
			:key="renderedSlice.key"
			v-bind="renderedSlice.props"
		/>
	</Wrapper>
</template>
