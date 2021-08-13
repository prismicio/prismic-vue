export { createPrismic } from "./createPrismic";
export { usePrismic } from "./usePrismic";

export {
	// Composables
	usePrismicLink,
	usePrismicText,
	usePrismicRichText,
	// Components
	PrismicEmbed,
	PrismicImage,
	PrismicLink,
	PrismicText,
	PrismicRichText,
	// Slice Zone
	getSliceComponentProps,
	TODOSliceComponent,
	SliceZoneImpl,
	SliceZone,
} from "./components";
export type {
	// Composables
	UsePrismicLinkOptions,
	UsePrismicTextOptions,
	UsePrismicRichTextOptions,
	// Components
	PrismicEmbedProps,
	PrismicImageProps,
	PrismicLinkProps,
	PrismicTextProps,
	PrismicRichTextProps,
	// Slice Zone
	DefineComponentSliceComponentProps,
	SliceComponentProps,
	SliceComponentType,
	SliceLike,
	SliceZoneComponents,
	SliceZoneLike,
	SliceZoneProps,
} from "./components";

export {
	useAllPrismicDocuments,
	useAllPrismicDocumentsByIDs,
	useAllPrismicDocumentsByTag,
	useAllPrismicDocumentsByTags,
	useAllPrismicDocumentsByType,
	useFirstPrismicDocument,
	usePrismicDocumentByID,
	usePrismicDocumentByUID,
	usePrismicDocuments,
	usePrismicDocumentsByIDs,
	usePrismicDocumentsByTag,
	usePrismicDocumentsByTags,
	usePrismicDocumentsByType,
	useSinglePrismicDocument,
} from "./composables";

export type { ClientComposableReturnType } from "./useStatefulPrismicClientMethod";

export { PrismicClientComposableState } from "./types";
export type { PrismicPluginOptions, PrismicPlugin } from "./types";

export { prismicKey } from "./injectionSymbols";

export * from "./globalExtensions";
