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

test("uses provided link resolver", (t) => {
	const wrapper = mount(PrismicRichTextImpl, {
		props: { field: richTextFixture.en, linkResolver: () => t.title },
	});

	t.true(wrapper.html().includes(`href="${t.title}"`));
});

test("uses provided HTML function serializer", (t) => {
	const wrapper = mount(PrismicRichTextImpl, {
		props: {
			field: richTextFixture.en,
			htmlSerializer: (type: Element) =>
				type === Element.paragraph ? `<p>${t.title}</p>` : null,
		},
	});

	t.true(wrapper.html().includes(`<p>${t.title}</p>`));
});

test("uses provided HTML map serializer", (t) => {
	const wrapper = mount(PrismicRichTextImpl, {
		props: {
			field: richTextFixture.en,
			htmlSerializer: { paragraph: () => `<p>${t.title}</p>` },
		},
	});

	t.true(wrapper.html().includes(`<p>${t.title}</p>`));
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
