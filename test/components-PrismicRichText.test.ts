import { it, expect, vi } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";

import { markRaw } from "vue";
import { routerKey } from "vue-router";
import { RichTextField } from "@prismicio/types";
import { Element } from "@prismicio/richtext";

import { richTextFixture } from "./__fixtures__/richText";
import { WrapperComponent } from "./__fixtures__/WrapperComponent";

import { PrismicRichTextImpl } from "../src/components";
import { createPrismic } from "../src";

it("renders rich text field as HTML", () => {
	const wrapper = mount(PrismicRichTextImpl, {
		props: { field: richTextFixture.en },
	});

	expect(wrapper.html()).toMatchSnapshot();
});

it("renders fallback when rich text is empty", () => {
	const wrapper1 = mount(PrismicRichTextImpl, {
		props: { field: [] },
	});

	expect(wrapper1.html()).toBe("<div></div>");

	const wrapper2 = mount(PrismicRichTextImpl, {
		props: { field: [], fallback: "foo" },
	});

	expect(wrapper2.html()).toBe("<div>foo</div>");

	const wrapper3 = mount(PrismicRichTextImpl, {
		props: { field: null, fallback: "bar" },
	});

	expect(wrapper3.html()).toBe("<div>bar</div>");

	const wrapper4 = mount(PrismicRichTextImpl, {
		props: { field: undefined, fallback: "baz" },
	});

	expect(wrapper4.html()).toBe("<div>baz</div>");
});

it("uses provided wrapper tag", () => {
	const wrapper = mount(PrismicRichTextImpl, {
		props: { field: richTextFixture.en, wrapper: "section" },
	});

	expect(wrapper.html()).toMatchSnapshot();
});

it("uses provided wrapper component", () => {
	const wrapper = mount(PrismicRichTextImpl, {
		props: { field: richTextFixture.en, wrapper: markRaw(WrapperComponent) },
	});

	expect(wrapper.html()).toMatchSnapshot();
});

it("uses plugin provided link resolver", (ctx) => {
	const spiedLinkResolver = vi.fn(() => ctx.meta.name);

	const prismic = createPrismic({
		endpoint: "test",
		linkResolver: spiedLinkResolver,
	});

	const wrapper = mount(PrismicRichTextImpl, {
		props: { field: richTextFixture.en },
		global: { plugins: [prismic] },
	});

	expect(spiedLinkResolver).toHaveBeenCalled();
	expect(wrapper.html()).toMatch(`href="${ctx.meta.name}"`);
});

it("uses provided link resolver over plugin provided", (ctx) => {
	const spiedLinkResolver1 = vi.fn(() => `${ctx.meta.name}1`);
	const spiedLinkResolver2 = vi.fn(() => `${ctx.meta.name}2`);

	const prismic = createPrismic({
		endpoint: "test",
		linkResolver: spiedLinkResolver1,
	});

	const wrapper = mount(PrismicRichTextImpl, {
		props: { field: richTextFixture.en, linkResolver: spiedLinkResolver2 },
		global: { plugins: [prismic] },
	});

	expect(spiedLinkResolver1).not.toHaveBeenCalled();
	expect(spiedLinkResolver2).toHaveBeenCalled();
	expect(wrapper.html()).toMatch(`href="${ctx.meta.name}2"`);
});

it("uses plugin provided HTML function serializer", (ctx) => {
	const spiedHTMLSerializer = vi.fn(
		(type: (typeof Element)[keyof typeof Element]) =>
			type === Element.paragraph ? `<p>${ctx.meta.name}</p>` : null,
	);

	const prismic = createPrismic({
		endpoint: "test",
		htmlSerializer: spiedHTMLSerializer,
	});

	const wrapper = mount(PrismicRichTextImpl, {
		props: {
			field: richTextFixture.en,
		},
		global: { plugins: [prismic] },
	});

	expect(spiedHTMLSerializer).toHaveBeenCalled();
	expect(wrapper.html()).toMatch(`<p>${ctx.meta.name}</p>`);
});

it("uses provided HTML function serializer over plugin provided", (ctx) => {
	const spiedHTMLSerializer1 = vi.fn(
		(type: (typeof Element)[keyof typeof Element]) =>
			type === Element.paragraph ? `<p>${ctx.meta.name}1</p>` : null,
	);
	const spiedHTMLSerializer2 = vi.fn(
		(type: (typeof Element)[keyof typeof Element]) =>
			type === Element.paragraph ? `<p>${ctx.meta.name}2</p>` : null,
	);

	const prismic = createPrismic({
		endpoint: "test",
		htmlSerializer: spiedHTMLSerializer1,
	});

	const wrapper = mount(PrismicRichTextImpl, {
		props: {
			field: richTextFixture.en,
			htmlSerializer: spiedHTMLSerializer2,
		},
		global: { plugins: [prismic] },
	});

	expect(spiedHTMLSerializer1).not.toHaveBeenCalled();
	expect(spiedHTMLSerializer2).toHaveBeenCalled();
	expect(wrapper.html()).toMatch(`<p>${ctx.meta.name}2</p>`);
});

it("uses plugin provided HTML map serializer", (ctx) => {
	const spiedHTMLSerializer = {
		paragraph: vi.fn(() => `<p>${ctx.meta.name}</p>`),
	};

	const prismic = createPrismic({
		endpoint: "test",
		htmlSerializer: spiedHTMLSerializer,
	});

	const wrapper = mount(PrismicRichTextImpl, {
		props: {
			field: richTextFixture.en,
		},
		global: { plugins: [prismic] },
	});

	expect(spiedHTMLSerializer.paragraph).toHaveBeenCalled();
	expect(wrapper.html()).toMatch(`<p>${ctx.meta.name}</p>`);
});

it("uses provided HTML map serializer over plugin provided", (ctx) => {
	const spiedHTMLSerializer1 = {
		paragraph: vi.fn(() => `<p>${ctx.meta.name}1</p>`),
	};
	const spiedHTMLSerializer2 = {
		paragraph: vi.fn(() => `<p>${ctx.meta.name}2</p>`),
	};

	const prismic = createPrismic({
		endpoint: "test",
		htmlSerializer: spiedHTMLSerializer1,
	});

	const wrapper = mount(PrismicRichTextImpl, {
		props: {
			field: richTextFixture.en,
			htmlSerializer: spiedHTMLSerializer2,
		},
		global: { plugins: [prismic] },
	});

	expect(spiedHTMLSerializer1.paragraph).not.toHaveBeenCalled();
	expect(spiedHTMLSerializer2.paragraph).toHaveBeenCalled();
	expect(wrapper.html()).toMatch(`<p>${ctx.meta.name}2</p>`);
});

it("navigates internal links using Vue Router if available on click", async () => {
	const spiedPush = vi.fn();

	const wrapper = mount(PrismicRichTextImpl, {
		props: {
			field: richTextFixture.link,
			htmlSerializer: {
				hyperlink: () => `<a href="/foo">link</a>`,
			},
		},
		global: {
			provide: {
				[routerKey as unknown as string]: {
					push: spiedPush,
				},
			},
		},
	});

	// Click doesn't propagate if we don't wait here
	await flushPromises();

	await wrapper.get("a").trigger("click");

	expect(spiedPush).toHaveBeenCalledOnce();
	expect(spiedPush).toHaveBeenCalledWith(`/foo`);

	// This is used to make sure `removeListeners()` is called upon unmount
	wrapper.unmount();
});

it("navigates internal links using Vue Router if available on click when using custom wrapper", async () => {
	const spiedPush = vi.fn();

	const wrapper = mount(PrismicRichTextImpl, {
		props: {
			field: richTextFixture.link,
			wrapper: markRaw(WrapperComponent),
			htmlSerializer: {
				hyperlink: () => `<a href="/foo">link</a>`,
			},
		},
		global: {
			provide: {
				[routerKey as unknown as string]: {
					push: spiedPush,
				},
			},
		},
	});

	// Click doesn't propagate if we don't wait here
	await flushPromises();

	await wrapper.get("a").trigger("click");

	expect(spiedPush).toHaveBeenCalledOnce();
	expect(spiedPush).toHaveBeenCalledWith(`/foo`);
});

it("navigates internal links using Vue Router if available on inner tag click", async () => {
	const spiedPush = vi.fn();

	const wrapper = mount(PrismicRichTextImpl, {
		props: {
			field: richTextFixture.link,
			htmlSerializer: {
				hyperlink: () => `<a href="/foo"><em>link</em></a>`,
			},
		},
		global: {
			provide: {
				[routerKey as unknown as string]: {
					push: spiedPush,
				},
			},
		},
	});

	// Click doesn't propagate if we don't wait here
	await flushPromises();

	await wrapper.get("a em").trigger("click");

	expect(spiedPush).toHaveBeenCalledOnce();
	expect(spiedPush).toHaveBeenCalledWith(`/foo`);
});

it("navigates internal links using Vue Router if available on deep inner tag click", async () => {
	const spiedPush = vi.fn();

	const wrapper = mount(PrismicRichTextImpl, {
		props: {
			field: richTextFixture.link,
			htmlSerializer: {
				hyperlink: () =>
					`<a href="/foo"><span><span><span><span><span><em>link<em></span></span></span></span></span></a>`,
			},
		},
		global: {
			provide: {
				[routerKey as unknown as string]: {
					push: spiedPush,
				},
			},
		},
	});

	// Click doesn't propagate if we don't wait here
	await flushPromises();

	await wrapper.get("a em").trigger("click");

	expect(spiedPush).toHaveBeenCalledOnce();
	expect(spiedPush).toHaveBeenCalledWith(`/foo`);
});

it("doesn't navigate external links using Vue Router if available on click (navigation error is expected)", async () => {
	const spiedPush = vi.fn();

	const wrapper = mount(PrismicRichTextImpl, {
		props: {
			field: richTextFixture.link,
			htmlSerializer: {
				hyperlink: () =>
					`<a data-external href="https://google.com">link</a><a data-internal href="/foo">link</a>`,
			},
		},
		global: {
			provide: {
				[routerKey as unknown as string]: {
					push: spiedPush,
				},
			},
		},
	});

	// Click doesn't propagate if we don't wait here
	await flushPromises();

	await wrapper.get("a[data-external]").trigger("click");

	expect(spiedPush).not.toHaveBeenCalled();

	await wrapper.get("a[data-internal]").trigger("click");

	expect(spiedPush).toHaveBeenCalledOnce();
	expect(spiedPush).toHaveBeenCalledWith(`/foo`);
});

it("doesn't try to bind on click events when Vue Router is available when rendering a comment node", async () => {
	await expect(async () => {
		const spiedPush = vi.fn();

		mount(PrismicRichTextImpl, {
			props: {
				field: richTextFixture.link,
				wrapper: markRaw(() => null),
				htmlSerializer: {
					hyperlink: () => `<a href="/foo">link</a>`,
				},
			},
			global: {
				provide: {
					[routerKey as unknown as string]: {
						push: spiedPush,
					},
				},
			},
		});

		// Click doesn't propagate if we don't wait here
		await flushPromises();
	}).not.toThrow();
});

it("reacts to changes properly", async () => {
	const wrapper = mount(PrismicRichTextImpl, {
		props: { field: richTextFixture.en },
	});

	const firstRender = wrapper.html();

	await wrapper.setProps({
		field: [{ type: "paragraph", text: "foo", spans: [] }] as RichTextField,
	});

	const secondRender = wrapper.html();

	expect(secondRender).not.toBe(firstRender);
	expect(secondRender).toBe(
		`<div>
  <p>foo</p>
</div>`,
	);
});
