export { default as PrismicRichText } from "./PrismicRichText/PrismicRichText.vue"
export type { PrismicRichTextProps } from "./PrismicRichText/PrismicRichText.vue"
export { getRichTextComponentProps } from "./PrismicRichText"
export type { RichTextComponents, RichTextComponentProps } from "./PrismicRichText"

export { default as PrismicTable } from "./PrismicTable/PrismicTable.vue"
export type { PrismicTableProps } from "./PrismicTable/PrismicTable.vue"
export { getTableComponentProps } from "./PrismicTable"
export type { TableComponents } from "./PrismicTable"

export { default as PrismicImage } from "./PrismicImage.vue"
export type { PrismicImageProps } from "./PrismicImage.vue"

export { default as PrismicLink } from "./PrismicLink.vue"
export type { PrismicLinkProps } from "./PrismicLink.vue"

export { default as PrismicText } from "./PrismicText.vue"
export type { PrismicTextProps } from "./PrismicText.vue"

export { default as SliceZone } from "./SliceZone/SliceZone.vue"
export type { SliceZoneProps } from "./SliceZone/SliceZone.vue"
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

export { createPrismic, usePrismic } from "./createPrismic"
export type { PrismicPlugin, PrismicPluginConfig } from "./createPrismic"
