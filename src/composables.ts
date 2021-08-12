import { Query } from "@prismicio/client";
import { PrismicDocument } from "@prismicio/types";

import {
	ClientMethodParameters,
	ClientComposableReturnType,
	useStatefulPrismicClientMethod,
	ComposableOnlyParameters,
} from "./useStatefulPrismicClientMethod";

// Composables
export const usePrismicDocuments = <TDocument extends PrismicDocument>(
	...args: [
		params?: ClientMethodParameters<"get">[0] & ComposableOnlyParameters,
	]
): ClientComposableReturnType<Query<TDocument>> =>
	useStatefulPrismicClientMethod("get", args);

export const useFirstPrismicDocument = <TDocument extends PrismicDocument>(
	...args: [
		params?: ClientMethodParameters<"getFirst">[0] & ComposableOnlyParameters,
	]
): ClientComposableReturnType<TDocument> =>
	useStatefulPrismicClientMethod("getFirst", args);

export const useAllPrismicDocuments = <TDocument extends PrismicDocument>(
	...args: [
		params?: ClientMethodParameters<"getAll">[0] & ComposableOnlyParameters,
	]
): ClientComposableReturnType<TDocument[]> =>
	useStatefulPrismicClientMethod("getAll", args);

export const usePrismicDocumentByID = <TDocument extends PrismicDocument>(
	...args: [
		id: ClientMethodParameters<"getByID">[0],
		params?: ClientMethodParameters<"getByID">[1] & ComposableOnlyParameters,
	]
): ClientComposableReturnType<TDocument> =>
	useStatefulPrismicClientMethod("getByID", args);

export const usePrismicDocumentsByIDs = <TDocument extends PrismicDocument>(
	...args: [
		ids: ClientMethodParameters<"getByIDs">[0],
		params?: ClientMethodParameters<"getByIDs">[1] & ComposableOnlyParameters,
	]
): ClientComposableReturnType<Query<TDocument>> =>
	useStatefulPrismicClientMethod("getByIDs", args);

export const useAllPrismicDocumentsByIDs = <TDocument extends PrismicDocument>(
	...args: [
		ids: ClientMethodParameters<"getAllByIDs">[0],
		params?: ClientMethodParameters<"getAllByIDs">[1] &
			ComposableOnlyParameters,
	]
): ClientComposableReturnType<TDocument[]> =>
	useStatefulPrismicClientMethod("getAllByIDs", args);

export const usePrismicDocumentByUID = <TDocument extends PrismicDocument>(
	...args: [
		documentType: ClientMethodParameters<"getByUID">[0],
		uid: ClientMethodParameters<"getByUID">[1],
		params?: ClientMethodParameters<"getByUID">[2] & ComposableOnlyParameters,
	]
): ClientComposableReturnType<TDocument> =>
	useStatefulPrismicClientMethod("getByUID", args);

export const useSinglePrismicDocument = <TDocument extends PrismicDocument>(
	...args: [
		documentType: ClientMethodParameters<"getSingle">[0],
		params?: ClientMethodParameters<"getSingle">[1] & ComposableOnlyParameters,
	]
): ClientComposableReturnType<TDocument> =>
	useStatefulPrismicClientMethod("getSingle", args);

export const usePrismicDocumentsByType = <TDocument extends PrismicDocument>(
	...args: [
		documentType: ClientMethodParameters<"getByType">[0],
		params?: ClientMethodParameters<"getByType">[1] & ComposableOnlyParameters,
	]
): ClientComposableReturnType<Query<TDocument>> =>
	useStatefulPrismicClientMethod("getByType", args);

export const useAllPrismicDocumentsByType = <TDocument extends PrismicDocument>(
	...args: [
		documentType: ClientMethodParameters<"getAllByType">[0],
		params?: ClientMethodParameters<"getAllByType">[1] &
			ComposableOnlyParameters,
	]
): ClientComposableReturnType<TDocument[]> =>
	useStatefulPrismicClientMethod("getAllByType", args);

export const usePrismicDocumentsByTag = <TDocument extends PrismicDocument>(
	...args: [
		tag: ClientMethodParameters<"getByTag">[0],
		params?: ClientMethodParameters<"getByTag">[1] & ComposableOnlyParameters,
	]
): ClientComposableReturnType<Query<TDocument>> =>
	useStatefulPrismicClientMethod("getByTag", args);

export const useAllPrismicDocumentsByTag = <TDocument extends PrismicDocument>(
	...args: [
		tag: ClientMethodParameters<"getAllByTag">[0],
		params?: ClientMethodParameters<"getAllByTag">[1] &
			ComposableOnlyParameters,
	]
): ClientComposableReturnType<TDocument[]> =>
	useStatefulPrismicClientMethod("getAllByTag", args);

export const usePrismicDocumentsByTags = <TDocument extends PrismicDocument>(
	...args: [
		tags: ClientMethodParameters<"getByTags">[0],
		params?: ClientMethodParameters<"getByTags">[1] & ComposableOnlyParameters,
	]
): ClientComposableReturnType<Query<TDocument>> =>
	useStatefulPrismicClientMethod("getByTags", args);

export const useAllPrismicDocumentsByTags = <TDocument extends PrismicDocument>(
	...args: [
		tags: ClientMethodParameters<"getAllByTags">[0],
		params?: ClientMethodParameters<"getAllByTags">[1] &
			ComposableOnlyParameters,
	]
): ClientComposableReturnType<TDocument[]> =>
	useStatefulPrismicClientMethod("getAllByTags", args);
