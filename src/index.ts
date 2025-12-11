export { default as PrismicRichText } from "./PrismicRichText/PrismicRichText.vue"
export { default as PrismicTable } from "./PrismicTable/PrismicTable.vue"
export { default as SliceZone } from "./SliceZone/SliceZone.vue"

export { default as PrismicEmbed } from "./PrismicEmbed.vue"
export { default as PrismicImage } from "./PrismicImage.vue"
export { default as PrismicLink } from "./PrismicLink.vue"
export { default as PrismicText } from "./PrismicText.vue"

export type { SliceZoneProps } from "./SliceZone/SliceZone.vue"
export type { PrismicRichTextProps } from "./PrismicRichText/PrismicRichText.vue"
export type { PrismicTableProps } from "./PrismicTable/PrismicTable.vue"

export type { PrismicEmbedProps } from "./PrismicEmbed.vue"
export type { PrismicImageProps } from "./PrismicImage.vue"
export type { PrismicLinkProps } from "./PrismicLink.vue"
export type { PrismicTextProps } from "./PrismicText.vue"

export { getRichTextComponentProps } from "./PrismicRichText"
export type {
	VueRichTextSerializer,
	RichTextComponentProps,
} from "./PrismicRichText"

export { getTableComponentProps } from "./PrismicTable"

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
