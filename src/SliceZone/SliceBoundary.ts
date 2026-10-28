import type { FunctionalComponent } from "vue"
import { createCommentVNode } from "vue"

export const SliceBoundary: FunctionalComponent<{ sliceId: string }> = (props, { slots }) => [
	createCommentVNode(`prismic-slice-start:${props.sliceId}`),
	slots.default?.(),
	createCommentVNode(`prismic-slice-end:${props.sliceId}`),
]

SliceBoundary.props = ["sliceId"]
