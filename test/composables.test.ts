import test, { ExecutionContext } from "ava";
import * as sinon from "sinon";
import { mount } from "@vue/test-utils";

import { defineComponent, ref } from "vue";
import { Client } from "@prismicio/client";

import { sleep } from "./__testutils__/sleep";

import {
	createPrismic,
	PrismicClientComposableState,
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
} from "../src";
import { useStatefulPrismicClientMethod } from "../src/useStatefulPrismicClientMethod";

const usesPluginClient = async (
	t: ExecutionContext,
	methodName: string,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	composable: (...args: any[]) => Promise<any> | any,
	additionalParams: (unknown | Record<string, unknown>)[] = [],
) => {
	const spiedClient = {
		[methodName]: sinon.spy((..._args: unknown[]) => {
			return "bar";
		}),
	};
	const prismic = createPrismic({
		client: spiedClient as unknown as Client,
	});

	let payload: ReturnType<typeof useStatefulPrismicClientMethod> =
		{} as ReturnType<typeof useStatefulPrismicClientMethod>;

	const wrapper = mount(
		defineComponent({
			setup() {
				payload = composable(...additionalParams);

				return () => payload?.data.value;
			},
		}),
		{
			global: {
				plugins: [prismic],
			},
		},
	);

	await sleep();

	t.is(wrapper.html(), "bar");
	t.is(payload?.state.value, PrismicClientComposableState.Success);
	t.is(spiedClient[methodName].callCount, 1);
	t.is(spiedClient[methodName].withArgs(...additionalParams).callCount, 1);
};
usesPluginClient.title = (
	providedTitle = "",
	_methodName: string,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	composable: (...args: any[]) => Promise<any> | any,
	_additionalParams: (unknown | Record<string, unknown>)[] = [],
) => providedTitle || `\`${composable.name}\` uses plugin client`;

/* eslint-disable prettier/prettier */

test(usesPluginClient, "get", usePrismicDocuments);
test(usesPluginClient, "getFirst", useFirstPrismicDocument);
test(usesPluginClient, "getAll", useAllPrismicDocuments);
test(usesPluginClient, "getByID", usePrismicDocumentByID, ["qux"]);
test(usesPluginClient, "getByIDs", usePrismicDocumentsByIDs, [["qux", "quux"]]);
test(usesPluginClient, "getAllByIDs", useAllPrismicDocumentsByIDs, [["qux", "quux"]]);
test(usesPluginClient, "getByUID", usePrismicDocumentByUID, ["qux", "quux"]);
test(usesPluginClient, "getSingle", useSinglePrismicDocument, ["qux"]);
test(usesPluginClient, "getByType", usePrismicDocumentsByType, ["qux"]);
test(usesPluginClient, "getAllByType", useAllPrismicDocumentsByType, ["qux"]);
test(usesPluginClient, "getByTag", usePrismicDocumentsByTag, ["qux"]);
test(usesPluginClient, "getAllByTag", useAllPrismicDocumentsByTag, ["qux"]);
test(usesPluginClient, "getByTags", usePrismicDocumentsByTags, [["qux", "quux"]]);
test(usesPluginClient, "getAllByTags", useAllPrismicDocumentsByTags, [["qux", "quux"]]);

/* eslint-enable prettier/prettier */

const usesProvidedClient = async (
	t: ExecutionContext,
	methodName: string,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	composable: (...args: any[]) => Promise<any> | any,
	additionalParams: (unknown | Record<string, unknown>)[] = [],
) => {
	const spiedClient1 = {
		[methodName]: sinon.spy((..._args: unknown[]) => {
			return "bar";
		}),
	};
	const spiedClient2 = {
		[methodName]: sinon.spy((..._args: unknown[]) => {
			return "baz";
		}),
	};
	const prismic = createPrismic({
		client: spiedClient1 as unknown as Client,
	});

	let payload: ReturnType<typeof useStatefulPrismicClientMethod> =
		{} as ReturnType<typeof useStatefulPrismicClientMethod>;

	const wrapper = mount(
		defineComponent({
			setup() {
				payload = composable(...additionalParams, {
					client: spiedClient2 as unknown as Client,
				});

				return () => payload?.data.value;
			},
		}),
		{
			global: {
				plugins: [prismic],
			},
		},
	);

	await sleep();

	t.is(wrapper.html(), "baz");
	t.is(payload?.state.value, PrismicClientComposableState.Success);
	t.false(spiedClient1[methodName].called);
	t.is(spiedClient2[methodName].callCount, 1);
	t.is(spiedClient2[methodName].withArgs(...additionalParams).callCount, 1);
};
usesProvidedClient.title = (
	providedTitle = "",
	_methodName: string,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	composable: (...args: any[]) => Promise<any> | any,
	_additionalParams: (unknown | Record<string, unknown>)[] = [],
) =>
	providedTitle ||
	`\`${composable.name}\` uses provided client over plugin client`;

/* eslint-disable prettier/prettier */

test(usesProvidedClient, "get", usePrismicDocuments);
test(usesProvidedClient, "getFirst", useFirstPrismicDocument);
test(usesProvidedClient, "getAll", useAllPrismicDocuments);
test(usesProvidedClient, "getByID", usePrismicDocumentByID, ["qux"]);
test(usesProvidedClient, "getByIDs", usePrismicDocumentsByIDs, [["qux", "quux"]]);
test(usesProvidedClient, "getAllByIDs", useAllPrismicDocumentsByIDs, [["qux", "quux"]]);
test(usesProvidedClient, "getByUID", usePrismicDocumentByUID, ["qux", "quux"]);
test(usesProvidedClient, "getSingle", useSinglePrismicDocument, ["qux"]);
test(usesProvidedClient, "getByType", usePrismicDocumentsByType, ["qux"]);
test(usesProvidedClient, "getAllByType", useAllPrismicDocumentsByType, ["qux"]);
test(usesProvidedClient, "getByTag", usePrismicDocumentsByTag, ["qux"]);
test(usesProvidedClient, "getAllByTag", useAllPrismicDocumentsByTag, ["qux"]);
test(usesProvidedClient, "getByTags", usePrismicDocumentsByTags, [["qux", "quux"]]);
test(usesProvidedClient, "getAllByTags", useAllPrismicDocumentsByTags, [["qux", "quux"]]);

/* eslint-enable prettier/prettier */

const supportsParams = async (
	t: ExecutionContext,
	methodName: string,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	composable: (...args: any[]) => Promise<any> | any,
	additionalParams: (unknown | Record<string, unknown>)[] = [],
) => {
	const spiedClient = {
		[methodName]: sinon.spy((..._args: unknown[]) => {
			return "bar";
		}),
	};
	const prismic = createPrismic({
		client: spiedClient as unknown as Client,
	});

	let payload: ReturnType<typeof useStatefulPrismicClientMethod> =
		{} as ReturnType<typeof useStatefulPrismicClientMethod>;

	const params = { ref: "foo" };

	const wrapper = mount(
		defineComponent({
			setup() {
				payload = composable(...additionalParams, params);

				return () => payload?.data.value;
			},
		}),
		{
			global: {
				plugins: [prismic],
			},
		},
	);

	await sleep();

	t.is(wrapper.html(), "bar");
	t.is(payload?.state.value, PrismicClientComposableState.Success);
	t.is(spiedClient[methodName].callCount, 1);
	t.is(
		spiedClient[methodName].withArgs(...additionalParams, params).callCount,
		1,
	);
};
supportsParams.title = (
	providedTitle = "",
	_methodName: string,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	composable: (...args: any[]) => Promise<any> | any,
	_additionalParams: (unknown | Record<string, unknown>)[] = [],
) => providedTitle || `\`${composable.name}\` supports params`;

/* eslint-disable prettier/prettier */

test(supportsParams, "get", usePrismicDocuments);
test(supportsParams, "getFirst", useFirstPrismicDocument);
test(supportsParams, "getAll", useAllPrismicDocuments);
test(supportsParams, "getByID", usePrismicDocumentByID, ["qux"]);
test(supportsParams, "getByIDs", usePrismicDocumentsByIDs, [["qux", "quux"]]);
test(supportsParams, "getAllByIDs", useAllPrismicDocumentsByIDs, [["qux", "quux"]]);
test(supportsParams, "getByUID", usePrismicDocumentByUID, ["qux", "quux"]);
test(supportsParams, "getSingle", useSinglePrismicDocument, ["qux"]);
test(supportsParams, "getByType", usePrismicDocumentsByType, ["qux"]);
test(supportsParams, "getAllByType", useAllPrismicDocumentsByType, ["qux"]);
test(supportsParams, "getByTag", usePrismicDocumentsByTag, ["qux"]);
test(supportsParams, "getAllByTag", useAllPrismicDocumentsByTag, ["qux"]);
test(supportsParams, "getByTags", usePrismicDocumentsByTags, [["qux", "quux"]]);
test(supportsParams, "getAllByTags", useAllPrismicDocumentsByTags, [["qux", "quux"]]);

/* eslint-enable prettier/prettier */

const watchesReactiveParams = async (
	t: ExecutionContext,
	methodName: string,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	composable: (...args: any[]) => Promise<any> | any,
	additionalParams: (unknown | Record<string, unknown>)[] = [],
) => {
	const spiedClient = {
		[methodName]: sinon.spy((...args: unknown[]) => {
			return (args[args.length - 1] as Record<string, string>).ref === "foo"
				? "bar"
				: "baz";
		}),
	};
	const prismic = createPrismic({
		client: spiedClient as unknown as Client,
	});

	let payload: ReturnType<typeof useStatefulPrismicClientMethod> =
		{} as ReturnType<typeof useStatefulPrismicClientMethod>;

	const params = ref<Record<string, string | null>>({ ref: "foo" });

	const wrapper = mount(
		defineComponent({
			setup() {
				payload = composable(...additionalParams, params);

				return () => payload?.data.value;
			},
		}),
		{
			global: {
				plugins: [prismic],
			},
		},
	);

	await sleep();

	t.is(wrapper.html(), "bar");
	t.is(payload?.state.value, PrismicClientComposableState.Success);
	t.is(spiedClient[methodName].callCount, 1);
	t.is(
		spiedClient[methodName].withArgs(...additionalParams, params.value)
			.callCount,
		1,
	);

	params.value = { ref: null };

	await sleep();

	t.is(wrapper.html(), "baz");
	t.is(payload?.state.value, PrismicClientComposableState.Success);
	t.is(spiedClient[methodName].callCount, 2);
	t.is(
		spiedClient[methodName].withArgs(...additionalParams, params.value)
			.callCount,
		1,
	);
};
watchesReactiveParams.title = (
	providedTitle = "",
	_methodName: string,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	composable: (...args: any[]) => Promise<any> | any,
	_additionalParams: (unknown | Record<string, unknown>)[] = [],
) => providedTitle || `\`${composable.name}\` watches reactive parameters`;

/* eslint-disable prettier/prettier */

test(watchesReactiveParams, "get", usePrismicDocuments);
test(watchesReactiveParams, "getFirst", useFirstPrismicDocument);
test(watchesReactiveParams, "getAll", useAllPrismicDocuments);
test(watchesReactiveParams, "getByID", usePrismicDocumentByID, ["qux"]);
test(watchesReactiveParams, "getByIDs", usePrismicDocumentsByIDs, [["qux", "quux"]]);
test(watchesReactiveParams, "getAllByIDs", useAllPrismicDocumentsByIDs, [["qux", "quux"]]);
test(watchesReactiveParams, "getByUID", usePrismicDocumentByUID, ["qux", "quux"]);
test(watchesReactiveParams, "getSingle", useSinglePrismicDocument, ["qux"]);
test(watchesReactiveParams, "getByType", usePrismicDocumentsByType, ["qux"]);
test(watchesReactiveParams, "getAllByType", useAllPrismicDocumentsByType, ["qux",]);
test(watchesReactiveParams, "getByTag", usePrismicDocumentsByTag, ["qux"]);
test(watchesReactiveParams, "getAllByTag", useAllPrismicDocumentsByTag, ["qux",]);
test(watchesReactiveParams, "getByTags", usePrismicDocumentsByTags, [["qux", "quux"]]);
test(watchesReactiveParams, "getAllByTags", useAllPrismicDocumentsByTags, [["qux", "quux"]]);

/* eslint-enable prettier/prettier */

const providesErrorStateOnError = async (
	t: ExecutionContext,
	methodName: string,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	composable: (...args: any[]) => Promise<any> | any,
	additionalParams: (unknown | Record<string, unknown>)[] = [],
) => {
	const spiedClient = {
		[methodName]: sinon.spy((...args: unknown[]) => {
			if ((args[args.length - 1] as Record<string, string>).ref !== "foo") {
				throw new Error("baz");
			}

			return "bar";
		}),
	};
	const prismic = createPrismic({
		client: spiedClient as unknown as Client,
	});

	let payload: ReturnType<typeof useStatefulPrismicClientMethod> =
		{} as ReturnType<typeof useStatefulPrismicClientMethod>;

	const params = ref<Record<string, string | null>>({ ref: null });

	const wrapper = mount(
		defineComponent({
			setup() {
				payload = composable(...additionalParams, params);

				return () => payload?.data.value;
			},
		}),
		{
			global: {
				plugins: [prismic],
			},
		},
	);

	await sleep();

	t.is(wrapper.html(), "<!---->");
	t.is(payload?.state.value, PrismicClientComposableState.Error);
	t.is(spiedClient[methodName].callCount, 1);
	t.is(spiedClient[methodName].exceptions.length, 1);
	t.is(
		spiedClient[methodName].withArgs(...additionalParams, params.value)
			.callCount,
		1,
	);

	params.value = { ref: "foo" };

	await sleep();

	t.is(wrapper.html(), "bar");
	t.is(payload?.state.value, PrismicClientComposableState.Success);
	t.is(spiedClient[methodName].callCount, 2);
	t.is(
		spiedClient[methodName].withArgs(...additionalParams, params.value)
			.callCount,
		1,
	);
};
providesErrorStateOnError.title = (
	providedTitle = "",
	_methodName: string,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	composable: (...args: any[]) => Promise<any> | any,
	_additionalParams: (unknown | Record<string, unknown>)[] = [],
) => providedTitle || `\`${composable.name}\` provides error state on error`;

/* eslint-disable prettier/prettier */

test(providesErrorStateOnError, "get", usePrismicDocuments);
test(providesErrorStateOnError, "getFirst", useFirstPrismicDocument);
test(providesErrorStateOnError, "getAll", useAllPrismicDocuments);
test(providesErrorStateOnError, "getByID", usePrismicDocumentByID, ["qux"]);
test(providesErrorStateOnError, "getByIDs", usePrismicDocumentsByIDs, [["qux", "quux"]]);
test(providesErrorStateOnError, "getAllByIDs", useAllPrismicDocumentsByIDs, [["qux", "quux"]]);
test(providesErrorStateOnError, "getByUID", usePrismicDocumentByUID, ["qux", "quux"]);
test(providesErrorStateOnError, "getSingle", useSinglePrismicDocument, ["qux"]);
test(providesErrorStateOnError, "getByType", usePrismicDocumentsByType, ["qux",]);
test(providesErrorStateOnError, "getAllByType", useAllPrismicDocumentsByType, ["qux"]);
test(providesErrorStateOnError, "getByTag", usePrismicDocumentsByTag, ["qux"]);
test(providesErrorStateOnError, "getAllByTag", useAllPrismicDocumentsByTag, ["qux"]);
test(providesErrorStateOnError, "getByTags", usePrismicDocumentsByTags, [["qux", "quux"]]);
test(providesErrorStateOnError, "getAllByTags", useAllPrismicDocumentsByTags, [["qux", "quux"]]);

/* eslint-enable prettier/prettier */
