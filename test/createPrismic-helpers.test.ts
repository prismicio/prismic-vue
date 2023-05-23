import { expect, it, vi } from "vitest";

import * as mock from "@prismicio/mock";
import { LinkType } from "@prismicio/client";
import { mount } from "@vue/test-utils";

import { WrapperComponent } from "./__fixtures__/WrapperComponent";
import { richTextFixture } from "./__fixtures__/richText";

import { createPrismic } from "../src";

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

it("`asHTML` uses provided default serializer", () => {
	const spiedRichTextSerializer = vi.fn();

	const prismic = createPrismic({
		endpoint: "test",
		richTextSerializer: spiedRichTextSerializer,
	});

	const wrapper = mount(WrapperComponent, {
		global: {
			plugins: [prismic],
		},
	});

	wrapper.vm.$prismic.asHTML(richTextFixture.en);

	expect(spiedRichTextSerializer).toHaveBeenCalled();
});

// TODO: Remove in v5
it("`asHTML` uses provided default deprecated serializer", () => {
	const spiedRichTextSerializer = vi.fn();

	const prismic = createPrismic({
		endpoint: "test",
		htmlSerializer: spiedRichTextSerializer,
	});

	const wrapper = mount(WrapperComponent, {
		global: {
			plugins: [prismic],
		},
	});

	wrapper.vm.$prismic.asHTML(richTextFixture.en);

	expect(spiedRichTextSerializer).toHaveBeenCalled();
});

it("`asHTML` uses provided HTML serializer over default provided", () => {
	const spiedRichTextSerializer1 = vi.fn();
	const spiedRichTextSerializer2 = vi.fn();

	const prismic = createPrismic({
		endpoint: "test",
		richTextSerializer: spiedRichTextSerializer1,
	});

	const wrapper = mount(WrapperComponent, {
		global: {
			plugins: [prismic],
		},
	});

	wrapper.vm.$prismic.asHTML(
		richTextFixture.en,
		null,
		spiedRichTextSerializer2,
	);

	expect(spiedRichTextSerializer1).not.toHaveBeenCalled();
	expect(spiedRichTextSerializer2).toHaveBeenCalled();
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
