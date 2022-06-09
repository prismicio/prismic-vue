export { createPrismic } from "./createPrismic";
export { usePrismic } from "./usePrismic";

export {
	// Composables
	usePrismicImage,
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
	defineSliceZoneComponents,
	SliceZone,
} from "./components";
export type {
	// Composables
	UsePrismicImageOptions,
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
	SliceLikeRestV2,
	SliceLikeGraphQL,
	SliceLike,
	SliceZoneComponents,
	SliceZoneResolver,
	SliceZoneLike,
	SliceZoneProps,
} from "./components";

export {
	useAllPrismicDocumentsByIDs,
	useAllPrismicDocumentsByUIDs,
	useAllPrismicDocumentsByTag,
	useAllPrismicDocumentsByEveryTag,
	useAllPrismicDocumentsBySomeTags,
	useAllPrismicDocumentsByType,
	useFirstPrismicDocument,
	usePrismicDocumentByID,
	usePrismicDocumentByUID,
	usePrismicDocuments,
	usePrismicDocumentsByIDs,
	usePrismicDocumentsByUIDs,
	usePrismicDocumentsByTag,
	usePrismicDocumentsByEveryTag,
	usePrismicDocumentsBySomeTags,
	usePrismicDocumentsByType,
	useSinglePrismicDocument,
	dangerouslyUseAllPrismicDocuments,
} from "./composables";

export type { ClientComposableReturnType } from "./useStatefulPrismicClientMethod";

export { PrismicClientComposableState } from "./types";
export type { PrismicPluginOptions, PrismicPlugin } from "./types";

export { prismicKey } from "./injectionSymbols";

export * from "./globalExtensions";
