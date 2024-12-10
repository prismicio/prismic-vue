import { expect, it, vi } from "vitest"

import { createClient, getRepositoryEndpoint } from "@prismicio/client"
import { mount } from "@vue/test-utils"

import { WrapperComponent } from "./__fixtures__/WrapperComponent"

import { createPrismic } from "../src"

it("creates client from repository name", () => {
	const prismic = createPrismic({ endpoint: "test" })

	const wrapper = mount(WrapperComponent, {
		global: {
			plugins: [prismic],
		},
	})

	expect(wrapper.vm.$prismic.client.endpoint).toBe(
		"https://test.cdn.prismic.io/api/v2",
	)
})

it("creates client from repository endpoint", () => {
	;[
		"https://test.cdn.prismic.io/api/v2",
		"https://test.prismic.io/api/v2",
		"https://test.cdn.wroom.io/api/v2",
	].forEach((endpoint) => {
		const prismic = createPrismic({
			endpoint,
		})

		const wrapper = mount(WrapperComponent, {
			global: {
				plugins: [prismic],
			},
		})

		expect(wrapper.vm.$prismic.client.endpoint).toBe(endpoint)
	})

	expect.assertions(3)
})

it("uses provided client", () => {
	const client = createClient(getRepositoryEndpoint("test"), {
		fetch: vi.fn(),
	})

	const prismic = createPrismic({ client })

	const wrapper = mount(WrapperComponent, {
		global: {
			plugins: [prismic],
		},
	})

	expect(wrapper.vm.$prismic.client).toBe(client)
	expect(wrapper.vm.$prismic.client.endpoint).toBe(client.endpoint)
})

it("uses `globalThis.fetch` by default", () => {
	const initialFetch = globalThis.fetch
	globalThis.fetch = vi.fn()

	const prismic = createPrismic({ endpoint: "test" })

	const wrapper = mount(WrapperComponent, {
		global: {
			plugins: [prismic],
		},
	})

	expect(globalThis.fetch).not.toHaveBeenCalled()
	wrapper.vm.$prismic.client.fetchFn("foo", {})
	expect(globalThis.fetch).toHaveBeenCalledOnce()

	globalThis.fetch = initialFetch
})

it("uses provided fetch function", () => {
	const spiedFetch = vi.fn()

	const prismic = createPrismic({
		endpoint: "test",
		clientConfig: {
			fetch: spiedFetch,
		},
	})

	const wrapper = mount(WrapperComponent, {
		global: {
			plugins: [prismic],
		},
	})

	expect(wrapper.vm.$prismic.client.fetchFn).toBe(spiedFetch)
	expect(spiedFetch).not.toHaveBeenCalled()
	wrapper.vm.$prismic.client.fetchFn("foo", {})
	expect(spiedFetch).toHaveBeenCalledOnce()
})

it("throws when `globalThis.fetch` is not available and no fetch function is provided", async () => {
	const initialFetch = globalThis.fetch
	// @ts-expect-error - We're deleting the global fetch function for testing purposes
	delete globalThis.fetch

	expect(() => createPrismic({ endpoint: "test" })).toThrowError(
		/a valid fetch implementation was not provided/i,
	)

	globalThis.fetch = initialFetch
})
