import { expect, it, vi } from "vitest"

import type { Client } from "@prismicio/client"
import { flushPromises, mount } from "@vue/test-utils"
import { defineComponent, ref } from "vue"

import {
	PrismicClientComposableState,
	createPrismic,
	dangerouslyUseAllPrismicDocuments,
	useAllPrismicDocumentsByEveryTag,
	useAllPrismicDocumentsByIDs,
	useAllPrismicDocumentsBySomeTags,
	useAllPrismicDocumentsByTag,
	useAllPrismicDocumentsByType,
	useAllPrismicDocumentsByUIDs,
	useFirstPrismicDocument,
	usePrismicDocumentByID,
	usePrismicDocumentByUID,
	usePrismicDocuments,
	usePrismicDocumentsByEveryTag,
	usePrismicDocumentsByIDs,
	usePrismicDocumentsBySomeTags,
	usePrismicDocumentsByTag,
	usePrismicDocumentsByType,
	usePrismicDocumentsByUIDs,
	useSinglePrismicDocument,
} from "../src"
import type { useStatefulPrismicClientMethod } from "../src/useStatefulPrismicClientMethod"

const usesPluginClient = (
	methodName: string,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	composable: (...args: any[]) => Promise<any> | any,
	additionalParams: (unknown | Record<string, unknown>)[] = [],
): [string, () => Promise<void>] => [
	`\`${composable.name}\` uses plugin client`,
	async () => {
		const spiedClient = {
			[methodName]: vi.fn((..._args: unknown[]) => {
				return "bar"
			}),
		}
		const prismic = createPrismic({
			client: spiedClient as unknown as Client,
		})

		let payload: ReturnType<typeof useStatefulPrismicClientMethod> =
			{} as ReturnType<typeof useStatefulPrismicClientMethod>

		const wrapper = mount(
			defineComponent({
				setup() {
					payload = composable(...additionalParams)

					return () => payload?.data.value
				},
			}),
			{
				global: {
					plugins: [prismic],
				},
			},
		)

		await flushPromises()

		expect(wrapper.html()).toBe("bar")
		expect(payload?.state.value).toBe(PrismicClientComposableState.Success)
		expect(spiedClient[methodName]).toHaveBeenCalledOnce()
		expect(spiedClient[methodName]).toHaveBeenCalledWith(
			...additionalParams,
			{},
		)
	},
]

it(...usesPluginClient("get", usePrismicDocuments))
it(...usesPluginClient("getFirst", useFirstPrismicDocument))
it(...usesPluginClient("getByID", usePrismicDocumentByID, ["qux"]))
it(...usesPluginClient("getByIDs", usePrismicDocumentsByIDs, [["qux", "quux"]]))
it(
	...usesPluginClient("getAllByIDs", useAllPrismicDocumentsByIDs, [
		["qux", "quux"],
	]),
)
it(...usesPluginClient("getByUID", usePrismicDocumentByUID, ["qux", "quux"]))
it(
	...usesPluginClient("getByUIDs", usePrismicDocumentsByUIDs, [
		"qux",
		["quux", "quuz"],
	]),
)
it(
	...usesPluginClient("getAllByUIDs", useAllPrismicDocumentsByUIDs, [
		"qux",
		["quux", "quuz"],
	]),
)
it(...usesPluginClient("getSingle", useSinglePrismicDocument, ["qux"]))
it(...usesPluginClient("getByType", usePrismicDocumentsByType, ["qux"]))
it(...usesPluginClient("getAllByType", useAllPrismicDocumentsByType, ["qux"]))
it(...usesPluginClient("getByTag", usePrismicDocumentsByTag, ["qux"]))
it(...usesPluginClient("getAllByTag", useAllPrismicDocumentsByTag, ["qux"]))
it(
	...usesPluginClient("getByEveryTag", usePrismicDocumentsByEveryTag, [
		["qux", "quux"],
	]),
)
it(
	...usesPluginClient("getAllByEveryTag", useAllPrismicDocumentsByEveryTag, [
		["qux", "quux"],
	]),
)
it(
	...usesPluginClient("getBySomeTags", usePrismicDocumentsBySomeTags, [
		["qux", "quux"],
	]),
)
it(
	...usesPluginClient("getAllBySomeTags", useAllPrismicDocumentsBySomeTags, [
		["qux", "quux"],
	]),
)
it(...usesPluginClient("dangerouslyGetAll", dangerouslyUseAllPrismicDocuments))

const usesProvidedClient = (
	methodName: string,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	composable: (...args: any[]) => Promise<any> | any,
	additionalParams: (unknown | Record<string, unknown>)[] = [],
): [string, () => Promise<void>] => [
	`\`${composable.name}\` uses provided client over plugin client`,
	async () => {
		const spiedClient1 = {
			[methodName]: vi.fn((..._args: unknown[]) => {
				return "bar"
			}),
		}
		const spiedClient2 = {
			[methodName]: vi.fn((..._args: unknown[]) => {
				return "baz"
			}),
		}
		const prismic = createPrismic({
			client: spiedClient1 as unknown as Client,
		})

		let payload: ReturnType<typeof useStatefulPrismicClientMethod> =
			{} as ReturnType<typeof useStatefulPrismicClientMethod>

		const wrapper = mount(
			defineComponent({
				setup() {
					payload = composable(...additionalParams, {
						client: spiedClient2 as unknown as Client,
					})

					return () => payload?.data.value
				},
			}),
			{
				global: {
					plugins: [prismic],
				},
			},
		)

		await flushPromises()

		expect(wrapper.html()).toBe("baz")
		expect(payload?.state.value).toBe(PrismicClientComposableState.Success)
		expect(spiedClient1[methodName]).not.toHaveBeenCalled()
		expect(spiedClient2[methodName]).toHaveBeenCalledOnce()
		expect(spiedClient2[methodName]).toHaveBeenCalledWith(
			...additionalParams,
			{},
		)
	},
]

it(...usesProvidedClient("get", usePrismicDocuments))
it(...usesProvidedClient("getFirst", useFirstPrismicDocument))
it(...usesProvidedClient("getByID", usePrismicDocumentByID, ["qux"]))
it(
	...usesProvidedClient("getByIDs", usePrismicDocumentsByIDs, [
		["qux", "quux"],
	]),
)
it(
	...usesProvidedClient("getAllByIDs", useAllPrismicDocumentsByIDs, [
		["qux", "quux"],
	]),
)
it(...usesProvidedClient("getByUID", usePrismicDocumentByUID, ["qux", "quux"]))
it(
	...usesProvidedClient("getByUIDs", usePrismicDocumentsByUIDs, [
		"qux",
		["quux", "quuz"],
	]),
)
it(
	...usesProvidedClient("getAllByUIDs", useAllPrismicDocumentsByUIDs, [
		"qux",
		["quux", "quuz"],
	]),
)
it(...usesProvidedClient("getSingle", useSinglePrismicDocument, ["qux"]))
it(...usesProvidedClient("getByType", usePrismicDocumentsByType, ["qux"]))
it(...usesProvidedClient("getAllByType", useAllPrismicDocumentsByType, ["qux"]))
it(...usesProvidedClient("getByTag", usePrismicDocumentsByTag, ["qux"]))
it(...usesProvidedClient("getAllByTag", useAllPrismicDocumentsByTag, ["qux"]))
it(
	...usesProvidedClient("getByEveryTag", usePrismicDocumentsByEveryTag, [
		["qux", "quux"],
	]),
)
it(
	...usesProvidedClient("getAllByEveryTag", useAllPrismicDocumentsByEveryTag, [
		["qux", "quux"],
	]),
)
it(
	...usesProvidedClient("getBySomeTags", usePrismicDocumentsBySomeTags, [
		["qux", "quux"],
	]),
)
it(
	...usesProvidedClient("getAllBySomeTags", useAllPrismicDocumentsBySomeTags, [
		["qux", "quux"],
	]),
)
it(
	...usesProvidedClient("dangerouslyGetAll", dangerouslyUseAllPrismicDocuments),
)

const supportsParams = (
	methodName: string,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	composable: (...args: any[]) => Promise<any> | any,
	additionalParams: (unknown | Record<string, unknown>)[] = [],
): [string, () => Promise<void>] => [
	`\`${composable.name}\` supports params`,
	async () => {
		const spiedClient = {
			[methodName]: vi.fn((..._args: unknown[]) => {
				return "bar"
			}),
		}
		const prismic = createPrismic({
			client: spiedClient as unknown as Client,
		})

		let payload: ReturnType<typeof useStatefulPrismicClientMethod> =
			{} as ReturnType<typeof useStatefulPrismicClientMethod>

		const params = { ref: "foo" }

		const wrapper = mount(
			defineComponent({
				setup() {
					payload = composable(...additionalParams, params)

					return () => payload?.data.value
				},
			}),
			{
				global: {
					plugins: [prismic],
				},
			},
		)

		await flushPromises()

		expect(wrapper.html()).toBe("bar")
		expect(payload?.state.value).toBe(PrismicClientComposableState.Success)
		expect(spiedClient[methodName]).toHaveBeenCalledOnce()
		expect(spiedClient[methodName]).toHaveBeenCalledWith(...additionalParams, {
			ref: "foo",
		})
	},
]

it(...supportsParams("get", usePrismicDocuments))
it(...supportsParams("getFirst", useFirstPrismicDocument))
it(...supportsParams("getByID", usePrismicDocumentByID, ["qux"]))
it(...supportsParams("getByIDs", usePrismicDocumentsByIDs, [["qux", "quux"]]))
it(
	...supportsParams("getAllByIDs", useAllPrismicDocumentsByIDs, [
		["qux", "quux"],
	]),
)
it(...supportsParams("getByUID", usePrismicDocumentByUID, ["qux", "quux"]))
it(
	...supportsParams("getByUIDs", usePrismicDocumentsByUIDs, [
		"qux",
		["quux", "quuz"],
	]),
)
it(
	...supportsParams("getAllByUIDs", useAllPrismicDocumentsByUIDs, [
		"qux",
		["quux", "quuz"],
	]),
)
it(...supportsParams("getSingle", useSinglePrismicDocument, ["qux"]))
it(...supportsParams("getByType", usePrismicDocumentsByType, ["qux"]))
it(...supportsParams("getAllByType", useAllPrismicDocumentsByType, ["qux"]))
it(...supportsParams("getByTag", usePrismicDocumentsByTag, ["qux"]))
it(...supportsParams("getAllByTag", useAllPrismicDocumentsByTag, ["qux"]))
it(
	...supportsParams("getByEveryTag", usePrismicDocumentsByEveryTag, [
		["qux", "quux"],
	]),
)
it(
	...supportsParams("getAllByEveryTag", useAllPrismicDocumentsByEveryTag, [
		["qux", "quux"],
	]),
)
it(
	...supportsParams("getBySomeTags", usePrismicDocumentsBySomeTags, [
		["qux", "quux"],
	]),
)
it(
	...supportsParams("getAllBySomeTags", useAllPrismicDocumentsBySomeTags, [
		["qux", "quux"],
	]),
)
it(...supportsParams("dangerouslyGetAll", dangerouslyUseAllPrismicDocuments))

const watchesReactiveParams = (
	methodName: string,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	composable: (...args: any[]) => Promise<any> | any,
	additionalParams: (unknown | Record<string, unknown>)[] = [],
): [string, () => Promise<void>] => [
	`\`${composable.name}\` watches reactive parameters`,
	async () => {
		const spiedClient = {
			[methodName]: vi.fn((...args: unknown[]) => {
				return (args[args.length - 1] as Record<string, string>).ref === "foo"
					? "bar"
					: "baz"
			}),
		}
		const prismic = createPrismic({
			client: spiedClient as unknown as Client,
		})

		let payload: ReturnType<typeof useStatefulPrismicClientMethod> =
			{} as ReturnType<typeof useStatefulPrismicClientMethod>

		const params = ref<Record<string, string | null>>({ ref: "foo" })

		const wrapper = mount(
			defineComponent({
				setup() {
					payload = composable(...additionalParams, params)

					return () => payload?.data.value
				},
			}),
			{
				global: {
					plugins: [prismic],
				},
			},
		)

		await flushPromises()

		expect(wrapper.html()).toBe("bar")
		expect(payload?.state.value, PrismicClientComposableState.Success)
		expect(spiedClient[methodName]).toHaveBeenCalledOnce()
		expect(spiedClient[methodName]).toHaveBeenCalledWith(...additionalParams, {
			ref: "foo",
		})

		params.value = { ref: null }

		await flushPromises()

		expect(wrapper.html()).toBe("baz")
		expect(payload?.state.value, PrismicClientComposableState.Success)
		expect(spiedClient[methodName]).toHaveBeenCalledTimes(2)
		expect(spiedClient[methodName]).toHaveBeenCalledWith(...additionalParams, {
			ref: null,
		})
	},
]

it(...watchesReactiveParams("get", usePrismicDocuments))
it(...watchesReactiveParams("getFirst", useFirstPrismicDocument))
it(...watchesReactiveParams("getByID", usePrismicDocumentByID, ["qux"]))
it(
	...watchesReactiveParams("getByIDs", usePrismicDocumentsByIDs, [
		["qux", "quux"],
	]),
)
it(
	...watchesReactiveParams("getAllByIDs", useAllPrismicDocumentsByIDs, [
		["qux", "quux"],
	]),
)
it(
	...watchesReactiveParams("getByUID", usePrismicDocumentByUID, [
		"qux",
		"quux",
	]),
)
it(
	...watchesReactiveParams("getByUIDs", usePrismicDocumentsByUIDs, [
		"qux",
		["quux", "quuz"],
	]),
)
it(
	...watchesReactiveParams("getAllByUIDs", useAllPrismicDocumentsByUIDs, [
		"qux",
		["quux", "quuz"],
	]),
)
it(...watchesReactiveParams("getSingle", useSinglePrismicDocument, ["qux"]))
it(...watchesReactiveParams("getByType", usePrismicDocumentsByType, ["qux"]))
it(
	...watchesReactiveParams("getAllByType", useAllPrismicDocumentsByType, [
		"qux",
	]),
)
it(...watchesReactiveParams("getByTag", usePrismicDocumentsByTag, ["qux"]))
it(
	...watchesReactiveParams("getAllByTag", useAllPrismicDocumentsByTag, ["qux"]),
)
it(
	...watchesReactiveParams("getByEveryTag", usePrismicDocumentsByEveryTag, [
		["qux", "quux"],
	]),
)
it(
	...watchesReactiveParams(
		"getAllByEveryTag",
		useAllPrismicDocumentsByEveryTag,
		[["qux", "quux"]],
	),
)
it(
	...watchesReactiveParams("getBySomeTags", usePrismicDocumentsBySomeTags, [
		["qux", "quux"],
	]),
)
it(
	...watchesReactiveParams(
		"getAllBySomeTags",
		useAllPrismicDocumentsBySomeTags,
		[["qux", "quux"]],
	),
)
it(
	...watchesReactiveParams(
		"dangerouslyGetAll",
		dangerouslyUseAllPrismicDocuments,
	),
)

// /* eslint-enable prettier/prettier */

const providesErrorStateOnError = (
	methodName: string,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	composable: (...args: any[]) => Promise<any> | any,
	additionalParams: (unknown | Record<string, unknown>)[] = [],
): [string, () => Promise<void>] => [
	`\`${composable.name}\` provides error state on error`,
	async () => {
		const spiedClient = {
			[methodName]: vi.fn((...args: unknown[]) => {
				if ((args[args.length - 1] as Record<string, string>).ref !== "foo") {
					throw new Error("baz")
				}

				return "bar"
			}),
		}
		const prismic = createPrismic({
			client: spiedClient as unknown as Client,
		})

		let payload: ReturnType<typeof useStatefulPrismicClientMethod> =
			{} as ReturnType<typeof useStatefulPrismicClientMethod>

		const params = ref<Record<string, string | null>>({ ref: null })

		const wrapper = mount(
			defineComponent({
				setup() {
					payload = composable(...additionalParams, params)

					return () => payload?.data.value
				},
			}),
			{
				global: {
					plugins: [prismic],
				},
			},
		)

		await flushPromises()

		expect(wrapper.html()).toBe("")
		expect(payload?.state.value).toBe(PrismicClientComposableState.Error)
		expect(spiedClient[methodName]).toHaveBeenCalledOnce()
		expect(vi.mocked(spiedClient[methodName]).mock.results[0].type).toBe(
			"throw",
		)
		expect(spiedClient[methodName]).toHaveBeenCalledWith(...additionalParams, {
			ref: null,
		})

		params.value = { ref: "foo" }

		await flushPromises()

		expect(wrapper.html()).toBe("bar")
		expect(payload?.state.value).toBe(PrismicClientComposableState.Success)
		expect(spiedClient[methodName]).toHaveBeenCalledTimes(2)
		expect(spiedClient[methodName]).toHaveBeenCalledWith(...additionalParams, {
			ref: "foo",
		})
	},
]

it(...providesErrorStateOnError("get", usePrismicDocuments))
it(...providesErrorStateOnError("getFirst", useFirstPrismicDocument))
it(...providesErrorStateOnError("getByID", usePrismicDocumentByID, ["qux"]))
it(
	...providesErrorStateOnError("getByIDs", usePrismicDocumentsByIDs, [
		["qux", "quux"],
	]),
)
it(
	...providesErrorStateOnError("getAllByIDs", useAllPrismicDocumentsByIDs, [
		["qux", "quux"],
	]),
)
it(
	...providesErrorStateOnError("getByUID", usePrismicDocumentByUID, [
		"qux",
		"quux",
	]),
)
it(
	...providesErrorStateOnError("getByUIDs", usePrismicDocumentsByUIDs, [
		"qux",
		["quux", "quuz"],
	]),
)
it(
	...providesErrorStateOnError("getAllByUIDs", useAllPrismicDocumentsByUIDs, [
		"qux",
		["quux", "quuz"],
	]),
)
it(...providesErrorStateOnError("getSingle", useSinglePrismicDocument, ["qux"]))
it(
	...providesErrorStateOnError("getByType", usePrismicDocumentsByType, ["qux"]),
)
it(
	...providesErrorStateOnError("getAllByType", useAllPrismicDocumentsByType, [
		"qux",
	]),
)
it(...providesErrorStateOnError("getByTag", usePrismicDocumentsByTag, ["qux"]))
it(
	...providesErrorStateOnError("getAllByTag", useAllPrismicDocumentsByTag, [
		"qux",
	]),
)
it(
	...providesErrorStateOnError("getByEveryTag", usePrismicDocumentsByEveryTag, [
		["qux", "quux"],
	]),
)
it(
	...providesErrorStateOnError(
		"getAllByEveryTag",
		useAllPrismicDocumentsByEveryTag,
		[["qux", "quux"]],
	),
)
it(
	...providesErrorStateOnError("getBySomeTags", usePrismicDocumentsBySomeTags, [
		["qux", "quux"],
	]),
)
it(
	...providesErrorStateOnError(
		"getAllBySomeTags",
		useAllPrismicDocumentsBySomeTags,
		[["qux", "quux"]],
	),
)
it(
	...providesErrorStateOnError(
		"dangerouslyGetAll",
		dangerouslyUseAllPrismicDocuments,
	),
)
