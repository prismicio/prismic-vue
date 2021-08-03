import { Client } from "@prismicio/client";

import {
	createClientComposableMultiple,
	createClientComposablePaginated,
	createClientComposableSingle,
} from "./createClientComposable";

// Helpers
const proto = Client.prototype;

type ClientPrototype = typeof Client.prototype;

type ClientMethodParameters<MethodName extends keyof ClientPrototype> =
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	ClientPrototype[MethodName] extends (...args: any[]) => any
		? Parameters<ClientPrototype[MethodName]>
		: never;

// Composables
export const usePrismicDocuments = createClientComposablePaginated<
	typeof proto.get,
	[params?: ClientMethodParameters<"get">[0]]
>(proto.get);

export const useFirstPrismicDocument = createClientComposableSingle<
	typeof proto.getFirst,
	[params?: ClientMethodParameters<"getFirst">[0]]
>(proto.getFirst);

export const useAllPrismicDocuments = createClientComposableMultiple<
	typeof proto.getAll,
	[params?: ClientMethodParameters<"getAll">[0]]
>(proto.getAll);

export const usePrismicDocumentByID = createClientComposableSingle<
	typeof proto.getByID,
	[
		id: ClientMethodParameters<"getByID">[0],
		params?: ClientMethodParameters<"getByID">[1],
	]
>(proto.getByID);

export const usePrismicDocumentsByIDs = createClientComposablePaginated<
	typeof proto.getByIDs,
	[
		ids: ClientMethodParameters<"getByIDs">[0],
		params?: ClientMethodParameters<"getByIDs">[1],
	]
>(proto.getByIDs);

export const useAllPrismicDocumentsByIDs = createClientComposableMultiple<
	typeof proto.getAllByIDs,
	[
		ids: ClientMethodParameters<"getAllByIDs">[0],
		params?: ClientMethodParameters<"getAllByIDs">[1],
	]
>(proto.getAllByIDs);

export const usePrismicDocumentByUID = createClientComposableSingle<
	typeof proto.getByUID,
	[
		documentType: ClientMethodParameters<"getByUID">[0],
		uid: ClientMethodParameters<"getByUID">[1],
		params?: ClientMethodParameters<"getByUID">[2],
	]
>(proto.getByUID);

export const useSinglePrismicDocument = createClientComposableSingle<
	typeof proto.getSingle,
	[
		documentType: ClientMethodParameters<"getSingle">[0],
		params?: ClientMethodParameters<"getSingle">[1],
	]
>(proto.getSingle);

export const usePrismicDocumentsByType = createClientComposablePaginated<
	typeof proto.getByType,
	[
		documentType: ClientMethodParameters<"getByType">[0],
		params?: ClientMethodParameters<"getByType">[1],
	]
>(proto.getByType);

export const useAllPrismicDocumentsByType = createClientComposableMultiple<
	typeof proto.getAllByType,
	[
		documentType: ClientMethodParameters<"getAllByType">[0],
		params?: ClientMethodParameters<"getAllByType">[1],
	]
>(proto.getAllByType);

export const usePrismicDocumentsByTag = createClientComposablePaginated<
	typeof proto.getByTag,
	[
		tag: ClientMethodParameters<"getByTag">[0],
		params?: ClientMethodParameters<"getByTag">[1],
	]
>(proto.getByTag);

export const useAllPrismicDocumentsByTag = createClientComposableMultiple<
	typeof proto.getAllByTag,
	[
		tag: ClientMethodParameters<"getAllByTag">[0],
		params?: ClientMethodParameters<"getAllByTag">[1],
	]
>(proto.getAllByTag);

export const usePrismicDocumentsByTags = createClientComposablePaginated<
	typeof proto.getByTags,
	[
		tag: ClientMethodParameters<"getByTags">[0],
		params?: ClientMethodParameters<"getByTags">[1],
	]
>(proto.getByTags);

export const useAllPrismicDocumentsByTags = createClientComposableMultiple<
	typeof proto.getAllByTags,
	[
		tag: ClientMethodParameters<"getAllByTags">[0],
		params?: ClientMethodParameters<"getAllByTags">[1],
	]
>(proto.getAllByTags);

// TODO: Remove
const { query: _q1, refresh: _r1 } = usePrismicDocumentsByIDs(["page"]);
const _t = usePrismicDocumentByUID("page", "home");
