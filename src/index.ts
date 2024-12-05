import PrismicEmbed from "./PrismicEmbed.vue"
import PrismicImage from "./PrismicImage.vue"
import PrismicLink from "./PrismicLink.vue"
import PrismicText from "./PrismicText.vue"

export type { PrismicEmbedProps } from "./PrismicEmbed.vue"
export type { PrismicImageProps } from "./PrismicImage.vue"
export type { PrismicLinkProps } from "./PrismicLink.vue"
export type { PrismicTextProps } from "./PrismicText.vue"

export { PrismicEmbed, PrismicImage, PrismicLink, PrismicText }

export {
	usePrismicRichText,
	PrismicRichTextImpl,
	PrismicRichText,
} from "./PrismicRichText"
export type {
	UsePrismicRichTextOptions,
	PrismicRichTextProps,
} from "./PrismicRichText"

export {
	getSliceComponentProps,
	TODOSliceComponent,
	defineSliceZoneComponents,
	SliceZoneImpl,
	SliceZone,
} from "./SliceZone"
export type {
	DefineComponentSliceComponentProps,
	SliceComponentProps,
	SliceComponentType,
	SliceLikeRestV2,
	SliceLikeGraphQL,
	SliceLike,
	SliceZoneComponents,
	SliceZoneResolverArgs,
	SliceZoneResolver,
	SliceZoneLike,
	SliceZoneProps,
} from "./SliceZone"

export type { PrismicPluginOptions, PrismicPlugin } from "./types"

export { createPrismic } from "./createPrismic"
export { usePrismic } from "./usePrismic"
export { prismicKey } from "./injectionSymbols"

export * from "./globalExtensions"
