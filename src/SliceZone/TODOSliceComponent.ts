import { DEV } from "esm-env"
import type { PropType } from "vue"
import { computed, defineComponent, h, watchEffect } from "vue"

import type { SliceComponentType, SliceLike } from "./types"

/**
 * This Slice component can be used as a reminder to provide a proper
 * implementation.
 *
 * This is also the default Vue component rendered when a component mapping
 * cannot be found in `<SliceZone />`.
 */
export const TODOSliceComponent = DEV
	? /*#__PURE__*/ (defineComponent({
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
						: props.slice.type
				})

				watchEffect(() => {
					console.warn(
						`[SliceZone] Could not find a component for Slice type "${type.value}"`,
						props.slice,
					)
				})

				return () => {
					return h(
						"section",
						{
							"data-slice-zone-todo-component": "",
							"data-slice-type": type.value,
						},
						[`Could not find a component for Slice type "${type.value}"`],
					)
				}
			},
		}) as SliceComponentType)
	: ((() => null) as SliceComponentType)
