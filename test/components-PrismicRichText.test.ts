import test from "ava";
import * as sinon from "sinon";
import { mount } from "@vue/test-utils";

import { markRaw } from "vue";
import { routerKey } from "vue-router";
import { RichTextField } from "@prismicio/types";
import { Element } from "@prismicio/richtext";

import { richTextFixture } from "./__fixtures__/richText";
import { WrapperComponent } from "./__fixtures__/WrapperComponent";
import { sleep } from "./__testutils__/sleep";

import { PrismicRichTextImpl } from "../src/components";
import { createPrismic } from "../src";

test("renders rich text field as plain text", (t) => {
	const wrapper = mount(PrismicRichTextImpl, {
		props: { field: richTextFixture.en },
	});

	t.snapshot(wrapper.html());
});

test("uses provided wrapper tag", (t) => {
	const wrapper = mount(PrismicRichTextImpl, {
		props: { field: richTextFixture.en, wrapper: "section" },
	});

	t.snapshot(wrapper.html());
});

test("uses provided wrapper component", (t) => {
	const wrapper = mount(PrismicRichTextImpl, {
		props: { field: richTextFixture.en, wrapper: markRaw(WrapperComponent) },
	});

	t.snapshot(wrapper.html());
});

test("uses plugin provided link resolver", (t) => {
	const spiedLinkResolver = sinon.spy(() => t.title);

	const prismic = createPrismic({
		endpoint: "test",
		linkResolver: spiedLinkResolver,
	});

	const wrapper = mount(PrismicRichTextImpl, {
		props: { field: richTextFixture.en },
		global: { plugins: [prismic] },
	});

	t.true(spiedLinkResolver.called);
	t.true(wrapper.html().includes(`href="${t.title}"`));
});

test("uses provided link resolver over plugin provided", (t) => {
	const spiedLinkResolver1 = sinon.spy(() => `${t.title}1`);
	const spiedLinkResolver2 = sinon.spy(() => `${t.title}2`);

	const prismic = createPrismic({
		endpoint: "test",
		linkResolver: spiedLinkResolver1,
	});

	const wrapper = mount(PrismicRichTextImpl, {
		props: { field: richTextFixture.en, linkResolver: spiedLinkResolver2 },
		global: { plugins: [prismic] },
	});

	t.false(spiedLinkResolver1.called);
	t.true(spiedLinkResolver2.called);
	t.true(wrapper.html().includes(`href="${t.title}2"`));
});

test("uses plugin provided HTML function serializer", (t) => {
	const spiedHTMLSerializer = sinon.spy((type: Element) =>
		type === Element.paragraph ? `<p>${t.title}</p>` : null,
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

	t.true(spiedHTMLSerializer.called);
	t.true(wrapper.html().includes(`<p>${t.title}</p>`));
});

test("uses provided HTML function serializer over plugin provided", (t) => {
	const spiedHTMLSerializer1 = sinon.spy((type: Element) =>
		type === Element.paragraph ? `<p>${t.title}1</p>` : null,
	);
	const spiedHTMLSerializer2 = sinon.spy((type: Element) =>
		type === Element.paragraph ? `<p>${t.title}2</p>` : null,
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

	t.false(spiedHTMLSerializer1.called);
	t.true(spiedHTMLSerializer2.called);
	t.true(wrapper.html().includes(`<p>${t.title}2</p>`));
});

test("uses plugin provided HTML map serializer", (t) => {
	const spiedHTMLSerializer = sinon.spy({
		paragraph: () => `<p>${t.title}</p>`,
	});

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

	t.true(spiedHTMLSerializer.paragraph.called);
	t.true(wrapper.html().includes(`<p>${t.title}</p>`));
});

test("uses provided HTML map serializer over plugin provided", (t) => {
	const spiedHTMLSerializer1 = sinon.spy({
		paragraph: () => `<p>${t.title}1</p>`,
	});
	const spiedHTMLSerializer2 = sinon.spy({
		paragraph: () => `<p>${t.title}2</p>`,
	});

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

	t.false(spiedHTMLSerializer1.paragraph.called);
	t.true(spiedHTMLSerializer2.paragraph.called);
	t.true(wrapper.html().includes(`<p>${t.title}2</p>`));
});

test("navigates internal links using Vue Router if available on click", async (t) => {
	const spiedPush = sinon.spy();

	const wrapper = mount(PrismicRichTextImpl, {
		props: {
			field: richTextFixture.link,
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
	await sleep();

	await wrapper.get("a[data-router-link]").trigger("click");

	t.is(1, spiedPush.callCount);

	wrapper.unmount();
});

test("navigates internal links using Vue Router if available on click when using custom wrapper", async (t) => {
	const spiedPush = sinon.spy();

	const wrapper = mount(PrismicRichTextImpl, {
		props: {
			field: richTextFixture.link,
			wrapper: markRaw(WrapperComponent),
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
	await sleep();

	await wrapper.get("a[data-router-link]").trigger("click");

	t.is(1, spiedPush.callCount);
});

test("navigates internal links using Vue Router if available on inner tag click", async (t) => {
	const spiedPush = sinon.spy();

	const wrapper = mount(PrismicRichTextImpl, {
		props: {
			field: richTextFixture.link,
			htmlSerializer: {
				hyperlink: () => `<a data-router-link href="/foo"><em>link</em></a>`,
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
	await sleep();

	await wrapper.get("a[data-router-link] em").trigger("click");

	t.is(1, spiedPush.callCount);
});

test("doesn't navigate internal links using Vue Router if available on too deep inner tag click", async (t) => {
	const spiedPush = sinon.spy();

	const wrapper = mount(PrismicRichTextImpl, {
		props: {
			field: richTextFixture.link,
			htmlSerializer: {
				hyperlink: () =>
					`<a data-router-link href="/foo"><span><span><span><span><span><em>link<em></span></span></span></span></span></a>`,
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
	await sleep();

	await wrapper.get("a[data-router-link] em").trigger("click");

	t.false(spiedPush.called);
});

test("doesn't navigate internal links using Vue Router if available when links are actually external (navigation error is expected)", async (t) => {
	const spiedPush = sinon.spy();

	const wrapper = mount(PrismicRichTextImpl, {
		props: {
			field: richTextFixture.link,
			htmlSerializer: {
				hyperlink: () =>
					`<a data-router-link href="https://google.com">link</a>`,
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
	await sleep();

	await wrapper.get("a[data-router-link]").trigger("click");

	t.false(spiedPush.called);
});

test("renders nothing when invalid", (t) => {
	const wrapper = mount(PrismicRichTextImpl, {
		props: { field: null as unknown as [] },
	});

	t.is(wrapper.html(), "<!---->");
});

test("reacts to changes properly", async (t) => {
	const wrapper = mount(PrismicRichTextImpl, {
		props: { field: richTextFixture.en },
	});

	const firstRender = wrapper.html();

	await wrapper.setProps({
		field: [{ type: "paragraph", text: "foo", spans: [] }] as RichTextField,
	});

	const secondRender = wrapper.html();

	t.not(secondRender, firstRender);
	t.is(
		secondRender,
		`<div>
  <p>foo</p>
</div>`,
	);
});
