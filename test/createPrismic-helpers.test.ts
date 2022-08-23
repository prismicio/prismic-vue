import { it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import * as mock from "@prismicio/mock";

import { WrapperComponent } from "./__fixtures__/WrapperComponent";

import { createPrismic } from "../src";
import { richTextFixture } from "./__fixtures__/richText";
import { LinkType } from "@prismicio/types";

it("`asHTML` uses provided default link resolver", () => {
	const spiedLinkResolver = vi.fn();

	const prismic = createPrismic({
		endpoint: "test",
		linkResolver: spiedLinkResolver,
	});

	const wrapper = mount(WrapperComponent, {
		global: {
			plugins: [prismic],
		},
	});

	wrapper.vm.$prismic.asHTML(richTextFixture.en);

	expect(spiedLinkResolver).toHaveBeenCalled();
});

it("`asHTML` uses provided link resolver over default provided", () => {
	const spiedLinkResolver1 = vi.fn();
	const spiedLinkResolver2 = vi.fn();

	const prismic = createPrismic({
		endpoint: "test",
		linkResolver: spiedLinkResolver1,
	});

	const wrapper = mount(WrapperComponent, {
		global: {
			plugins: [prismic],
		},
	});

	wrapper.vm.$prismic.asHTML(richTextFixture.en, spiedLinkResolver2);

	expect(spiedLinkResolver1).not.toHaveBeenCalled();
	expect(spiedLinkResolver2).toHaveBeenCalled();
});

it("`asHTML` uses provided default HTML serializer", () => {
	const spiedHTMLSerializer = vi.fn();

	const prismic = createPrismic({
		endpoint: "test",
		htmlSerializer: spiedHTMLSerializer,
	});

	const wrapper = mount(WrapperComponent, {
		global: {
			plugins: [prismic],
		},
	});

	wrapper.vm.$prismic.asHTML(richTextFixture.en);

	expect(spiedHTMLSerializer).toHaveBeenCalled();
});

it("`asHTML` uses provided HTML serializer over default provided", () => {
	const spiedHTMLSerializer1 = vi.fn();
	const spiedHTMLSerializer2 = vi.fn();

	const prismic = createPrismic({
		endpoint: "test",
		htmlSerializer: spiedHTMLSerializer1,
	});

	const wrapper = mount(WrapperComponent, {
		global: {
			plugins: [prismic],
		},
	});

	wrapper.vm.$prismic.asHTML(richTextFixture.en, null, spiedHTMLSerializer2);

	expect(spiedHTMLSerializer1).not.toHaveBeenCalled();
	expect(spiedHTMLSerializer2).toHaveBeenCalled();
});

it("`asLink` uses provided default link resolver", (ctx) => {
	const spiedLinkResolver = vi.fn();

	const prismic = createPrismic({
		endpoint: "test",
		linkResolver: spiedLinkResolver,
	});

	const wrapper = mount(WrapperComponent, {
		global: {
			plugins: [prismic],
		},
	});

	wrapper.vm.$prismic.asLink({
		...mock.value.link({ type: LinkType.Document, seed: ctx.meta.name }),
		url: undefined,
	});

	expect(spiedLinkResolver).toHaveBeenCalledOnce();
});

it("`asLink` uses provided link resolver over default provided", (ctx) => {
	const spiedLinkResolver1 = vi.fn();
	const spiedLinkResolver2 = vi.fn();

	const prismic = createPrismic({
		endpoint: "test",
		linkResolver: spiedLinkResolver1,
	});

	const wrapper = mount(WrapperComponent, {
		global: {
			plugins: [prismic],
		},
	});

	wrapper.vm.$prismic.asLink(
		{
			...mock.value.link({ type: LinkType.Document, seed: ctx.meta.name }),
			url: undefined,
		},
		spiedLinkResolver2,
	);

	expect(spiedLinkResolver1).not.toHaveBeenCalled();
	expect(spiedLinkResolver2).toHaveBeenCalledOnce();
});
