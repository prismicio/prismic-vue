/* eslint-disable @typescript-eslint/no-unused-vars */
// Imports for @link references:
import type { Client } from "@prismicio/client";

/* eslint-enable @typescript-eslint/no-unused-vars */
import { PrismicDocument, Query } from "@prismicio/client";

import {
	ClientComposableReturnType,
	ClientMethodParameters,
	ComposableOnlyParameters,
	useStatefulPrismicClientMethod,
} from "./useStatefulPrismicClientMethod";

// Composables

/**
 * A composable that queries content from the Prismic repository.
 *
 * @remarks
 * An additional `@prismicio/client` instance can be provided at
 * `params.client`.
 * @typeParam TDocument - Type of Prismic documents returned
 *
 * @param params - Parameters to filter, sort, and paginate results
 *
 * @returns The composable payload {@link ClientComposableReturnType}
 *
 * @see Underlying `@prismicio/client` method {@link Client.get}
 */
export const usePrismicDocuments = <TDocument extends PrismicDocument>(
	...args: [
		params?: ClientMethodParameters<"get">[0] & ComposableOnlyParameters,
	]
): ClientComposableReturnType<Query<TDocument>> =>
	useStatefulPrismicClientMethod("get", args);

/**
 * A composable that queries content from the Prismic repository and returns
 * only the first result, if any.
 *
 * @remarks
 * An additional `@prismicio/client` instance can be provided at
 * `params.client`.
 * @typeParam TDocument - Type of the Prismic document returned
 *
 * @param params - Parameters to filter, sort, and paginate results
 *
 * @returns The composable payload {@link ClientComposableReturnType}
 *
 * @see Underlying `@prismicio/client` method {@link Client.getFirst}
 */
export const useFirstPrismicDocument = <TDocument extends PrismicDocument>(
	...args: [
		params?: ClientMethodParameters<"getFirst">[0] & ComposableOnlyParameters,
	]
): ClientComposableReturnType<TDocument> =>
	useStatefulPrismicClientMethod("getFirst", args);

/**
 * A composable that queries a document from the Prismic repository with a
 * specific ID.
 *
 * @remarks
 * An additional `@prismicio/client` instance can be provided at
 * `params.client`.
 * @typeParam TDocument - Type of the Prismic document returned
 *
 * @param id - ID of the document
 * @param params - Parameters to filter, sort, and paginate results
 *
 * @returns The composable payload {@link ClientComposableReturnType}
 *
 * @see Underlying `@prismicio/client` method {@link Client.getByID}
 */
export const usePrismicDocumentByID = <TDocument extends PrismicDocument>(
	...args: [
		id: ClientMethodParameters<"getByID">[0],
		params?: ClientMethodParameters<"getByID">[1] & ComposableOnlyParameters,
	]
): ClientComposableReturnType<TDocument> =>
	useStatefulPrismicClientMethod("getByID", args);

/**
 * A composable that queries documents from the Prismic repository with specific
 * IDs.
 *
 * @remarks
 * An additional `@prismicio/client` instance can be provided at
 * `params.client`.
 * @typeParam TDocument - Type of Prismic documents returned
 *
 * @param ids - A list of document IDs
 * @param params - Parameters to filter, sort, and paginate results
 *
 * @returns The composable payload {@link ClientComposableReturnType}
 *
 * @see Underlying `@prismicio/client` method {@link Client.getByIDs}
 */
export const usePrismicDocumentsByIDs = <TDocument extends PrismicDocument>(
	...args: [
		ids: ClientMethodParameters<"getByIDs">[0],
		params?: ClientMethodParameters<"getByIDs">[1] & ComposableOnlyParameters,
	]
): ClientComposableReturnType<Query<TDocument>> =>
	useStatefulPrismicClientMethod("getByIDs", args);

/**
 * A composable that queries all documents from the Prismic repository with
 * specific IDs.
 *
 * @remarks
 * An additional `@prismicio/client` instance can be provided at
 * `params.client`.
 * @typeParam TDocument - Type of Prismic documents returned
 *
 * @param ids - A list of document IDs
 * @param params - Parameters to filter and sort results
 *
 * @returns The composable payload {@link ClientComposableReturnType}
 *
 * @see Underlying `@prismicio/client` method {@link Client.getAllByIDs}
 */
export const useAllPrismicDocumentsByIDs = <TDocument extends PrismicDocument>(
	...args: [
		ids: ClientMethodParameters<"getAllByIDs">[0],
		params?: ClientMethodParameters<"getAllByIDs">[1] &
			ComposableOnlyParameters,
	]
): ClientComposableReturnType<TDocument[]> =>
	useStatefulPrismicClientMethod("getAllByIDs", args);

/**
 * A composable that queries a document from the Prismic repository with a
 * specific UID and Custom Type.
 *
 * @remarks
 * An additional `@prismicio/client` instance can be provided at
 * `params.client`.
 * @typeParam TDocument - Type of the Prismic document returned
 *
 * @param documentType - The API ID of the document's Custom Type
 * @param uid - UID of the document
 * @param params - Parameters to filter, sort, and paginate results
 *
 * @returns The composable payload {@link ClientComposableReturnType}
 *
 * @see Underlying `@prismicio/client` method {@link Client.getByUID}
 */
export const usePrismicDocumentByUID = <TDocument extends PrismicDocument>(
	...args: [
		documentType: ClientMethodParameters<"getByUID">[0],
		uid: ClientMethodParameters<"getByUID">[1],
		params?: ClientMethodParameters<"getByUID">[2] & ComposableOnlyParameters,
	]
): ClientComposableReturnType<TDocument> =>
	useStatefulPrismicClientMethod("getByUID", args);

/**
 * A composable that queries documents from the Prismic repository with specific
 * UIDs.
 *
 * @remarks
 * An additional `@prismicio/client` instance can be provided at
 * `params.client`.
 * @typeParam TDocument - Type of Prismic documents returned
 *
 * @param documentType - The API ID of the document's Custom Type
 * @param uids - A list of document UIDs
 * @param params - Parameters to filter, sort, and paginate results
 *
 * @returns The composable payload {@link ClientComposableReturnType}
 *
 * @see Underlying `@prismicio/client` method {@link Client.getByIDs}
 */
export const usePrismicDocumentsByUIDs = <TDocument extends PrismicDocument>(
	...args: [
		documentType: ClientMethodParameters<"getByUIDs">[0],
		uids: ClientMethodParameters<"getByUIDs">[1],
		params?: ClientMethodParameters<"getByUIDs">[2] & ComposableOnlyParameters,
	]
): ClientComposableReturnType<Query<TDocument>> =>
	useStatefulPrismicClientMethod("getByUIDs", args);

/**
 * A composable that queries all documents from the Prismic repository with
 * specific UIDs.
 *
 * @remarks
 * An additional `@prismicio/client` instance can be provided at
 * `params.client`.
 * @typeParam TDocument - Type of Prismic documents returned
 *
 * @param documentType - The API ID of the document's Custom Type
 * @param uids - A list of document UIDs
 * @param params - Parameters to filter and sort results
 *
 * @returns The composable payload {@link ClientComposableReturnType}
 *
 * @see Underlying `@prismicio/client` method {@link Client.getAllByIDs}
 */
export const useAllPrismicDocumentsByUIDs = <TDocument extends PrismicDocument>(
	...args: [
		documentType: ClientMethodParameters<"getAllByUIDs">[0],
		ids: ClientMethodParameters<"getAllByUIDs">[1],
		params?: ClientMethodParameters<"getAllByUIDs">[2] &
			ComposableOnlyParameters,
	]
): ClientComposableReturnType<TDocument[]> =>
	useStatefulPrismicClientMethod("getAllByUIDs", args);

/**
 * A composable that queries a singleton document from the Prismic repository
 * for a specific Custom Type.
 *
 * @remarks
 * An additional `@prismicio/client` instance can be provided at
 * `params.client`.
 * @typeParam TDocument - Type of the Prismic document returned
 *
 * @param documentType - The API ID of the singleton Custom Type
 * @param params - Parameters to filter, sort, and paginate results
 *
 * @returns The composable payload {@link ClientComposableReturnType}
 *
 * @see Underlying `@prismicio/client` method {@link Client.getSingle}
 */
export const useSinglePrismicDocument = <TDocument extends PrismicDocument>(
	...args: [
		documentType: ClientMethodParameters<"getSingle">[0],
		params?: ClientMethodParameters<"getSingle">[1] & ComposableOnlyParameters,
	]
): ClientComposableReturnType<TDocument> =>
	useStatefulPrismicClientMethod("getSingle", args);

/**
 * A composable that queries documents from the Prismic repository for a
 * specific Custom Type.
 *
 * @remarks
 * An additional `@prismicio/client` instance can be provided at
 * `params.client`.
 * @typeParam TDocument - Type of Prismic documents returned
 *
 * @param documentType - The API ID of the Custom Type
 * @param params - Parameters to filter, sort, and paginate results
 *
 * @returns The composable payload {@link ClientComposableReturnType}
 *
 * @see Underlying `@prismicio/client` method {@link Client.getByType}
 */
export const usePrismicDocumentsByType = <TDocument extends PrismicDocument>(
	...args: [
		documentType: ClientMethodParameters<"getByType">[0],
		params?: ClientMethodParameters<"getByType">[1] & ComposableOnlyParameters,
	]
): ClientComposableReturnType<Query<TDocument>> =>
	useStatefulPrismicClientMethod("getByType", args);

/**
 * A composable that queries all documents from the Prismic repository for a
 * specific Custom Type.
 *
 * @remarks
 * An additional `@prismicio/client` instance can be provided at
 * `params.client`.
 * @typeParam TDocument - Type of Prismic documents returned
 *
 * @param documentType - The API ID of the Custom Type
 * @param params - Parameters to filter and sort results
 *
 * @returns The composable payload {@link ClientComposableReturnType}
 *
 * @see Underlying `@prismicio/client` method {@link Client.getAllByType}
 */
export const useAllPrismicDocumentsByType = <TDocument extends PrismicDocument>(
	...args: [
		documentType: ClientMethodParameters<"getAllByType">[0],
		params?: ClientMethodParameters<"getAllByType">[1] &
			ComposableOnlyParameters,
	]
): ClientComposableReturnType<TDocument[]> =>
	useStatefulPrismicClientMethod("getAllByType", args);

/**
 * A composable that queries documents from the Prismic repository with a
 * specific tag.
 *
 * @remarks
 * An additional `@prismicio/client` instance can be provided at
 * `params.client`.
 * @typeParam TDocument - Type of Prismic documents returned
 *
 * @param tag - The tag that must be included on a document
 * @param params - Parameters to filter, sort, and paginate results
 *
 * @returns The composable payload {@link ClientComposableReturnType}
 *
 * @see Underlying `@prismicio/client` method {@link Client.getByTag}
 */
export const usePrismicDocumentsByTag = <TDocument extends PrismicDocument>(
	...args: [
		tag: ClientMethodParameters<"getByTag">[0],
		params?: ClientMethodParameters<"getByTag">[1] & ComposableOnlyParameters,
	]
): ClientComposableReturnType<Query<TDocument>> =>
	useStatefulPrismicClientMethod("getByTag", args);

/**
 * A composable that queries all documents from the Prismic repository with a
 * specific tag.
 *
 * @remarks
 * An additional `@prismicio/client` instance can be provided at
 * `params.client`.
 * @typeParam TDocument - Type of Prismic documents returned
 *
 * @param tag - The tag that must be included on a document
 * @param params - Parameters to filter and sort results
 *
 * @returns The composable payload {@link ClientComposableReturnType}
 *
 * @see Underlying `@prismicio/client` method {@link Client.getAllByTag}
 */
export const useAllPrismicDocumentsByTag = <TDocument extends PrismicDocument>(
	...args: [
		tag: ClientMethodParameters<"getAllByTag">[0],
		params?: ClientMethodParameters<"getAllByTag">[1] &
			ComposableOnlyParameters,
	]
): ClientComposableReturnType<TDocument[]> =>
	useStatefulPrismicClientMethod("getAllByTag", args);

/**
 * A composable that queries documents from the Prismic repository with specific
 * tags. A document must be tagged with all of the queried tags to be included.
 *
 * @remarks
 * An additional `@prismicio/client` instance can be provided at
 * `params.client`.
 * @typeParam TDocument - Type of Prismic documents returned
 *
 * @param tags - A list of tags that must be included on a document
 * @param params - Parameters to filter, sort, and paginate results
 *
 * @returns The composable payload {@link ClientComposableReturnType}
 *
 * @see Underlying `@prismicio/client` method {@link Client.getByTags}
 */
export const usePrismicDocumentsByEveryTag = <
	TDocument extends PrismicDocument,
>(
	...args: [
		tags: ClientMethodParameters<"getByEveryTag">[0],
		params?: ClientMethodParameters<"getByEveryTag">[1] &
			ComposableOnlyParameters,
	]
): ClientComposableReturnType<Query<TDocument>> =>
	useStatefulPrismicClientMethod("getByEveryTag", args);

/**
 * A composable that queries all documents from the Prismic repository with
 * specific tags. A document must be tagged with all of the queried tags to be
 * included.
 *
 * @remarks
 * An additional `@prismicio/client` instance can be provided at
 * `params.client`.
 * @typeParam TDocument - Type of Prismic documents returned
 *
 * @param tags - A list of tags that must be included on a document
 * @param params - Parameters to filter and sort results
 *
 * @returns The composable payload {@link ClientComposableReturnType}
 *
 * @see Underlying `@prismicio/client` method {@link Client.getAllByTags}
 */
export const useAllPrismicDocumentsByEveryTag = <
	TDocument extends PrismicDocument,
>(
	...args: [
		tags: ClientMethodParameters<"getAllByEveryTag">[0],
		params?: ClientMethodParameters<"getAllByEveryTag">[1] &
			ComposableOnlyParameters,
	]
): ClientComposableReturnType<TDocument[]> =>
	useStatefulPrismicClientMethod("getAllByEveryTag", args);

/**
 * A composable that queries documents from the Prismic repository with specific
 * tags. A document must be tagged with at least one of the queried tags to be
 * included.
 *
 * @remarks
 * An additional `@prismicio/client` instance can be provided at
 * `params.client`.
 * @typeParam TDocument - Type of Prismic documents returned
 *
 * @param tags - A list of tags that must be included on a document
 * @param params - Parameters to filter, sort, and paginate results
 *
 * @returns The composable payload {@link ClientComposableReturnType}
 *
 * @see Underlying `@prismicio/client` method {@link Client.getByTags}
 */
export const usePrismicDocumentsBySomeTags = <
	TDocument extends PrismicDocument,
>(
	...args: [
		tags: ClientMethodParameters<"getBySomeTags">[0],
		params?: ClientMethodParameters<"getBySomeTags">[1] &
			ComposableOnlyParameters,
	]
): ClientComposableReturnType<Query<TDocument>> =>
	useStatefulPrismicClientMethod("getBySomeTags", args);

/**
 * A composable that queries all documents from the Prismic repository with
 * specific tags. A document must be tagged with at least one of the queried
 * tags to be included.
 *
 * @remarks
 * An additional `@prismicio/client` instance can be provided at
 * `params.client`.
 * @typeParam TDocument - Type of Prismic documents returned
 *
 * @param tags - A list of tags that must be included on a document
 * @param params - Parameters to filter and sort results
 *
 * @returns The composable payload {@link ClientComposableReturnType}
 *
 * @see Underlying `@prismicio/client` method {@link Client.getAllByTags}
 */
export const useAllPrismicDocumentsBySomeTags = <
	TDocument extends PrismicDocument,
>(
	...args: [
		tags: ClientMethodParameters<"getAllBySomeTags">[0],
		params?: ClientMethodParameters<"getAllBySomeTags">[1] &
			ComposableOnlyParameters,
	]
): ClientComposableReturnType<TDocument[]> =>
	useStatefulPrismicClientMethod("getAllBySomeTags", args);

/**
 * **IMPORTANT**: Avoid using `dangerouslyUseAllPrismicDocuments` as it may be
 * slower and require more resources than other composables. Prefer using other
 * composables that filter by predicates such as
 * `useAllPrismicDocumentsByType`.
 *
 * A composable that queries content from the Prismic repository and returns all
 * matching content. If no predicates are provided, all documents will be
 * fetched.
 *
 * @remarks
 * An additional `@prismicio/client` instance can be provided at
 * `params.client`.
 * @typeParam TDocument - Type of Prismic documents returned
 *
 * @param params - Parameters to filter and sort results
 *
 * @returns The composable payload {@link ClientComposableReturnType}
 *
 * @see Underlying `@prismicio/client` method {@link Client.getAll}
 */
export const dangerouslyUseAllPrismicDocuments = <
	TDocument extends PrismicDocument,
>(
	...args: [
		params?: ClientMethodParameters<"dangerouslyGetAll">[0] &
			ComposableOnlyParameters,
	]
): ClientComposableReturnType<TDocument[]> =>
	useStatefulPrismicClientMethod("dangerouslyGetAll", args);
