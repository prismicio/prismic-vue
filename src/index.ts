import PrismicRichText from "./PrismicRichText/PrismicRichText.vue"
import SliceZone from "./SliceZone/SliceZone.vue"

import PrismicEmbed from "./PrismicEmbed.vue"
import PrismicImage from "./PrismicImage.vue"
import PrismicLink from "./PrismicLink.vue"
import PrismicText from "./PrismicText.vue"

export type { SliceZoneProps } from "./SliceZone/SliceZone.vue"
export type { PrismicRichTextProps } from "./PrismicRichText/PrismicRichText.vue"

export type { PrismicEmbedProps } from "./PrismicEmbed.vue"
export type { PrismicImageProps } from "./PrismicImage.vue"
export type { PrismicLinkProps } from "./PrismicLink.vue"
export type { PrismicTextProps } from "./PrismicText.vue"

export {
	SliceZone,
	PrismicRichText,
	PrismicEmbed,
	PrismicImage,
	PrismicLink,
	PrismicText,
}

export { getRichTextComponentProps } from "./PrismicRichText"
export type {
	VueRichTextSerializer,
	RichTextComponentProps,
} from "./PrismicRichText"

export {
	TODOSliceComponent,
	defineSliceZoneComponents,
	getSliceComponentProps,
} from "./SliceZone"
export type {
	SliceComponentProps,
	SliceComponentType,
	SliceLike,
	SliceLikeGraphQL,
	SliceLikeRestV2,
	SliceZoneComponents,
	SliceZoneLike,
} from "./SliceZone"

export type { PrismicPluginOptions, PrismicPlugin } from "./types"

export { createPrismic } from "./createPrismic"
export { usePrismic, prismicKey } from "./usePrismic"
