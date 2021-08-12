import test from "ava";
import * as sinon from "sinon";
import { mount } from "@vue/test-utils";

import { createClient, getEndpoint } from "@prismicio/client";

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

test("creates client from API endpoint", (t) => {
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
	const client = createClient(getEndpoint("test"), { fetch: sinon.stub() });

	const prismic = createPrismic({ client });

	const wrapper = mount(WrapperComponent, {
		global: {
			plugins: [prismic],
		},
	});

	t.is(wrapper.vm.$prismic.client, client);
	t.is(wrapper.vm.$prismic.client.endpoint, client.endpoint);
});
