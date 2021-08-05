import { Client, Query } from "@prismicio/client";
import { PrismicDocument } from "@prismicio/types";

import {
	ClientMethodParameters,
	ClientComposableReturnType,
	useStatefulPrismicClientMethod,
} from "./useStatefulPrismicClientMethod";

// Helpers
const proto = Client.prototype;

// Composables
export const usePrismicDocuments = <DocumentType extends PrismicDocument>(
	...args: ClientMethodParameters<"get">
): ClientComposableReturnType<Query<DocumentType>> =>
	useStatefulPrismicClientMethod(proto.get, args);

export const useFirstPrismicDocument = <DocumentType extends PrismicDocument>(
	...args: ClientMethodParameters<"getFirst">
): ClientComposableReturnType<DocumentType> =>
	useStatefulPrismicClientMethod(proto.getFirst, args);

export const useAllPrismicDocuments = <DocumentType extends PrismicDocument>(
	...args: ClientMethodParameters<"getAll">
): ClientComposableReturnType<DocumentType[]> =>
	useStatefulPrismicClientMethod(proto.getAll, args);

export const usePrismicDocumentByID = <DocumentType extends PrismicDocument>(
	...args: ClientMethodParameters<"getByID">
): ClientComposableReturnType<DocumentType> =>
	useStatefulPrismicClientMethod(proto.getByID, args);

export const usePrismicDocumentsByIDs = <DocumentType extends PrismicDocument>(
	...args: ClientMethodParameters<"getByIDs">
): ClientComposableReturnType<Query<DocumentType>> =>
	useStatefulPrismicClientMethod(proto.getByIDs, args);

export const useAllPrismicDocumentsByIDs = <
	DocumentType extends PrismicDocument,
>(
	...args: ClientMethodParameters<"getAllByIDs">
): ClientComposableReturnType<DocumentType[]> =>
	useStatefulPrismicClientMethod(proto.getAllByIDs, args);

export const usePrismicDocumentByUID = <DocumentType extends PrismicDocument>(
	...args: ClientMethodParameters<"getByUID">
): ClientComposableReturnType<DocumentType> =>
	useStatefulPrismicClientMethod(proto.getByUID, args);

export const useSinglePrismicDocument = <DocumentType extends PrismicDocument>(
	...args: ClientMethodParameters<"getSingle">
): ClientComposableReturnType<DocumentType> =>
	useStatefulPrismicClientMethod(proto.getSingle, args);

export const usePrismicDocumentsByType = <DocumentType extends PrismicDocument>(
	...args: ClientMethodParameters<"getByType">
): ClientComposableReturnType<Query<DocumentType>> =>
	useStatefulPrismicClientMethod(proto.getByType, args);

export const useAllPrismicDocumentsByType = <
	DocumentType extends PrismicDocument,
>(
	...args: ClientMethodParameters<"getAllByType">
): ClientComposableReturnType<DocumentType[]> =>
	useStatefulPrismicClientMethod(proto.getAllByType, args);

export const usePrismicDocumentsByTag = <DocumentType extends PrismicDocument>(
	...args: ClientMethodParameters<"getByTag">
): ClientComposableReturnType<Query<DocumentType>> =>
	useStatefulPrismicClientMethod(proto.getByTag, args);

export const useAllPrismicDocumentsByTag = <
	DocumentType extends PrismicDocument,
>(
	...args: ClientMethodParameters<"getAllByTag">
): ClientComposableReturnType<DocumentType[]> =>
	useStatefulPrismicClientMethod(proto.getAllByTag, args);

export const usePrismicDocumentsByTags = <DocumentType extends PrismicDocument>(
	...args: ClientMethodParameters<"getByTags">
): ClientComposableReturnType<Query<DocumentType>> =>
	useStatefulPrismicClientMethod(proto.getByTags, args);

export const useAllPrismicDocumentsByTags = <
	DocumentType extends PrismicDocument,
>(
	...args: ClientMethodParameters<"getAllByTags">
): ClientComposableReturnType<DocumentType[]> =>
	useStatefulPrismicClientMethod(proto.getAllByTags, args);
