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
export const usePrismicDocuments = <TDocument extends PrismicDocument>(
	...args: ClientMethodParameters<"get">
): ClientComposableReturnType<Query<TDocument>> =>
	useStatefulPrismicClientMethod(proto.get, args);

export const useFirstPrismicDocument = <TDocument extends PrismicDocument>(
	...args: ClientMethodParameters<"getFirst">
): ClientComposableReturnType<TDocument> =>
	useStatefulPrismicClientMethod(proto.getFirst, args);

export const useAllPrismicDocuments = <TDocument extends PrismicDocument>(
	...args: ClientMethodParameters<"getAll">
): ClientComposableReturnType<TDocument[]> =>
	useStatefulPrismicClientMethod(proto.getAll, args);

export const usePrismicDocumentByID = <TDocument extends PrismicDocument>(
	...args: ClientMethodParameters<"getByID">
): ClientComposableReturnType<TDocument> =>
	useStatefulPrismicClientMethod(proto.getByID, args);

export const usePrismicDocumentsByIDs = <TDocument extends PrismicDocument>(
	...args: ClientMethodParameters<"getByIDs">
): ClientComposableReturnType<Query<TDocument>> =>
	useStatefulPrismicClientMethod(proto.getByIDs, args);

export const useAllPrismicDocumentsByIDs = <TDocument extends PrismicDocument>(
	...args: ClientMethodParameters<"getAllByIDs">
): ClientComposableReturnType<TDocument[]> =>
	useStatefulPrismicClientMethod(proto.getAllByIDs, args);

export const usePrismicDocumentByUID = <TDocument extends PrismicDocument>(
	...args: ClientMethodParameters<"getByUID">
): ClientComposableReturnType<TDocument> =>
	useStatefulPrismicClientMethod(proto.getByUID, args);

export const useSinglePrismicDocument = <TDocument extends PrismicDocument>(
	...args: ClientMethodParameters<"getSingle">
): ClientComposableReturnType<TDocument> =>
	useStatefulPrismicClientMethod(proto.getSingle, args);

export const usePrismicDocumentsByType = <TDocument extends PrismicDocument>(
	...args: ClientMethodParameters<"getByType">
): ClientComposableReturnType<Query<TDocument>> =>
	useStatefulPrismicClientMethod(proto.getByType, args);

export const useAllPrismicDocumentsByType = <TDocument extends PrismicDocument>(
	...args: ClientMethodParameters<"getAllByType">
): ClientComposableReturnType<TDocument[]> =>
	useStatefulPrismicClientMethod(proto.getAllByType, args);

export const usePrismicDocumentsByTag = <TDocument extends PrismicDocument>(
	...args: ClientMethodParameters<"getByTag">
): ClientComposableReturnType<Query<TDocument>> =>
	useStatefulPrismicClientMethod(proto.getByTag, args);

export const useAllPrismicDocumentsByTag = <TDocument extends PrismicDocument>(
	...args: ClientMethodParameters<"getAllByTag">
): ClientComposableReturnType<TDocument[]> =>
	useStatefulPrismicClientMethod(proto.getAllByTag, args);

export const usePrismicDocumentsByTags = <TDocument extends PrismicDocument>(
	...args: ClientMethodParameters<"getByTags">
): ClientComposableReturnType<Query<TDocument>> =>
	useStatefulPrismicClientMethod(proto.getByTags, args);

export const useAllPrismicDocumentsByTags = <TDocument extends PrismicDocument>(
	...args: ClientMethodParameters<"getAllByTags">
): ClientComposableReturnType<TDocument[]> =>
	useStatefulPrismicClientMethod(proto.getAllByTags, args);
