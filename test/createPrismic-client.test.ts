import test from "ava";
import * as sinon from "sinon";
import { mount } from "@vue/test-utils";

import { createClient, getRepositoryEndpoint } from "@prismicio/client";

import { WrapperComponent } from "./__fixtures__/WrapperComponent";

import { createPrismic } from "../src";

test("creates client from repository name", (t) => {
	const prismic = createPrismic({ endpoint: "test" });

	const wrapper = mount(WrapperComponent, {
		global: {
			plugins: [prismic],
		},
	});

	t.is(
		wrapper.vm.$prismic.client.endpoint,
		"https://test.cdn.prismic.io/api/v2",
	);
});

test("creates client from repository endpoint", (t) => {
	let i = 0;
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

		t.is(wrapper.vm.$prismic.client.endpoint, endpoint);
		i++;
	});

	t.is(i, 3);
});

test("uses provided client", (t) => {
	const client = createClient(getRepositoryEndpoint("test"), {
		fetch: sinon.stub(),
	});

	const prismic = createPrismic({ client });

	const wrapper = mount(WrapperComponent, {
		global: {
			plugins: [prismic],
		},
	});

	t.is(wrapper.vm.$prismic.client, client);
	t.is(wrapper.vm.$prismic.client.endpoint, client.endpoint);
});

test("uses provided fetch function", (t) => {
	const spiedFetch = sinon.spy();

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

	t.is(wrapper.vm.$prismic.client.fetchFn, spiedFetch);
	t.false(spiedFetch.called);
	wrapper.vm.$prismic.client.fetchFn("foo", {});
	t.is(spiedFetch.callCount, 1);
});

test("uses `globalThis` fetch function when available", (t) => {
	// `globalThis.fetch` does not exists in our Node.js context
	const fetchStub = (globalThis.fetch = sinon.stub());

	const prismic = createPrismic({ endpoint: "test" });

	const wrapper = mount(WrapperComponent, {
		global: {
			plugins: [prismic],
		},
	});

	t.false(fetchStub.called);
	wrapper.vm.$prismic.client.fetchFn("foo", {});
	t.is(fetchStub.callCount, 1);

	// @ts-expect-error `globalThis.fetch` does not exists in our Node.js context
	delete globalThis.fetch;
});

test("uses `isomorphic-unfetch` when `globalThis` fetch function is not available", async (t) => {
	const prismic = createPrismic({ endpoint: "test" });

	const wrapper = mount(WrapperComponent, {
		global: {
			plugins: [prismic],
		},
	});

	// We test for fetch to throw by providing invalid arguments
	await t.throwsAsync(
		async () => {
			await wrapper.vm.$prismic.client.fetchFn("foo", {});
		},
		{ instanceOf: TypeError, message: "Only absolute URLs are supported" },
	);
});
