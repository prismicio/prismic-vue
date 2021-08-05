export { createPrismic } from "./createPrismic";
export { usePrismic } from "./usePrismic";


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
