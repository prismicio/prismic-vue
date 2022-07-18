import { it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";

import unfetch from "isomorphic-unfetch";
import { createClient, getRepositoryEndpoint } from "@prismicio/client";

import { WrapperComponent } from "./__fixtures__/WrapperComponent";

import { createPrismic } from "../src";

it("creates client from repository name", () => {
	const prismic = createPrismic({ endpoint: "test" });

	const wrapper = mount(WrapperComponent, {
		global: {
			plugins: [prismic],
		},
	});

	expect(wrapper.vm.$prismic.client.endpoint).toBe(
		"https://test.cdn.prismic.io/api/v2",
	);
});

it("creates client from repository endpoint", () => {
	[
		"https://test.cdn.prismic.io/api/v2",
		"https://test.prismic.io/api/v2",
		"https://test.cdn.wroom.io/api/v2",
	].forEach((endpoint) => {
		const prismic = createPrismic({
			endpoint,
		});

		const wrapper = mount(WrapperComponent, {
			global: {
				plugins: [prismic],
			},
		});

		expect(wrapper.vm.$prismic.client.endpoint).toBe(endpoint);
	});

	expect.assertions(3);
});

it("uses provided client", () => {
	const client = createClient(getRepositoryEndpoint("test"), {
		fetch: vi.fn(),
	});

	const prismic = createPrismic({ client });

	const wrapper = mount(WrapperComponent, {
		global: {
			plugins: [prismic],
		},
	});

	expect(wrapper.vm.$prismic.client).toBe(client);
	expect(wrapper.vm.$prismic.client.endpoint).toBe(client.endpoint);
});

it("uses provided fetch function", () => {
	const spiedFetch = vi.fn();

	const prismic = createPrismic({
		endpoint: "test",
		clientConfig: {
			fetch: spiedFetch,
		},
	});

	const wrapper = mount(WrapperComponent, {
		global: {
			plugins: [prismic],
		},
	});

	expect(wrapper.vm.$prismic.client.fetchFn).toBe(spiedFetch);
	expect(spiedFetch).not.toHaveBeenCalled();
	wrapper.vm.$prismic.client.fetchFn("foo", {});
	expect(spiedFetch).toHaveBeenCalledOnce();
});

it("uses `globalThis` fetch function when available", () => {
	// `globalThis.fetch` does not exists in our Node.js context
	const fetchStub = (globalThis.fetch = vi.fn());

	const prismic = createPrismic({ endpoint: "test" });

	const wrapper = mount(WrapperComponent, {
		global: {
			plugins: [prismic],
		},
	});

	expect(fetchStub).not.toHaveBeenCalled();
	wrapper.vm.$prismic.client.fetchFn("foo", {});
	expect(fetchStub).toHaveBeenCalledOnce();

	// @ts-expect-error `globalThis.fetch` does not exists in our Node.js context
	delete globalThis.fetch;
});

it("uses `isomorphic-unfetch` when `globalThis` fetch function is not available", async () => {
	vi.mock("isomorphic-unfetch", () => {
		return {
			default: vi.fn(),
		};
	});

	const prismic = createPrismic({ endpoint: "test" });

	const wrapper = mount(WrapperComponent, {
		global: {
			plugins: [prismic],
		},
	});

	expect(unfetch).not.toHaveBeenCalled();
	await wrapper.vm.$prismic.client.fetchFn("foo", {});
	expect(unfetch).toHaveBeenCalledOnce();

	vi.unmock("isomorphic-unfetch");
});
