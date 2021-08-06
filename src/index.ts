export { createPrismic } from "./createPrismic";
export { usePrismic } from "./usePrismic";

export {
	usePrismicLink,
	usePrismicText,
	usePrismicRichText,
	PrismicEmbed,
	PrismicImage,
	PrismicLink,
	PrismicText,
	PrismicRichText,
} from "./components";
export type {
	UsePrismicLinkOptions,
	UsePrismicTextOptions,
	UsePrismicRichTextOptions,
	PrismicEmbedProps,
	PrismicImageProps,
	PrismicLinkProps,
	PrismicTextProps,
	PrismicRichTextProps,
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

export { PrismicClientComposableState } from "./types";
export type { PrismicPluginOptions, PrismicPlugin } from "./types";

export { prismicKey } from "./injectionSymbols";

export * from "./globalExtensions";
