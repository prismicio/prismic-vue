import test from "ava";
import * as sinon from "sinon";
import { mount, createLocalVue } from "@vue/test-utils";

import Vue from "vue";
import PrismicDOM from "prismic-dom";
const Element = PrismicDOM.RichText.Elements;

import { richTextFixture } from "./__fixtures__/richText";
import { WrapperComponent } from "./__fixtures__/WrapperComponent";

import PrismicRichTextImpl from "../src/components/RichText";
import PrismicVue from "../src";

const PrismicRichText = Vue.component("PrismicRichText", PrismicRichTextImpl);

test("renders rich text field as plain text", (t) => {
	const wrapper = mount(PrismicRichText, {
		propsData: { field: richTextFixture.en },
	});

	t.snapshot(wrapper.html());
});

test("uses provided wrapper tag", (t) => {
	const wrapper = mount(PrismicRichText, {
		propsData: { field: richTextFixture.en, wrapper: "section" },
	});

	t.snapshot(wrapper.html());
});

test("uses provided wrapper component", (t) => {
	const wrapper = mount(PrismicRichText, {
		propsData: {
			field: richTextFixture.en,
			wrapper: WrapperComponent,
		},
	});

	t.snapshot(wrapper.html());
});

test("uses plugin provided link resolver", (t) => {
	const localVue = createLocalVue();

	const spiedLinkResolver = sinon.spy(() => t.title);

	localVue.use(PrismicVue, {
		endpoint: "test",
		linkResolver: spiedLinkResolver,
	});

	const wrapper = mount(PrismicRichText, {
		propsData: { field: richTextFixture.en },
		localVue,
	});

	t.true(spiedLinkResolver.called);
	t.true(wrapper.html().includes(`href="${t.title}"`));
});

test("uses provided link resolver over plugin provided", (t) => {
	const localVue = createLocalVue();

	const spiedLinkResolver1 = sinon.spy(() => `${t.title}1`);
	const spiedLinkResolver2 = sinon.spy(() => `${t.title}2`);

	localVue.use(PrismicVue, {
		endpoint: "test",
		linkResolver: spiedLinkResolver1,
	});

	const wrapper = mount(PrismicRichText, {
		propsData: { field: richTextFixture.en, linkResolver: spiedLinkResolver2 },
		localVue,
	});

	t.false(spiedLinkResolver1.called);
	t.true(spiedLinkResolver2.called);
	t.true(wrapper.html().includes(`href="${t.title}2"`));
});

test("uses plugin provided HTML function serializer", (t) => {
	const localVue = createLocalVue();

	const spiedHTMLSerializer = sinon.spy((type) =>
		type === Element.paragraph ? `<p>${t.title}</p>` : null,
	);

	localVue.use(PrismicVue, {
		endpoint: "test",
		htmlSerializer: spiedHTMLSerializer,
	});

	const wrapper = mount(PrismicRichText, {
		propsData: {
			field: richTextFixture.en,
		},
		localVue,
	});

	t.true(spiedHTMLSerializer.called);
	t.true(wrapper.html().includes(`<p>${t.title}</p>`));
});

test("uses provided HTML function serializer over plugin provided", (t) => {
	const localVue = createLocalVue();

	const spiedHTMLSerializer1 = sinon.spy((type) =>
		type === Element.paragraph ? `<p>${t.title}1</p>` : null,
	);
	const spiedHTMLSerializer2 = sinon.spy((type) =>
		type === Element.paragraph ? `<p>${t.title}2</p>` : null,
	);

	localVue.use(PrismicVue, {
		endpoint: "test",
		htmlSerializer: spiedHTMLSerializer1,
	});

	const wrapper = mount(PrismicRichText, {
		propsData: {
			field: richTextFixture.en,
			htmlSerializer: spiedHTMLSerializer2,
		},
		localVue,
	});

	t.false(spiedHTMLSerializer1.called);
	t.true(spiedHTMLSerializer2.called);
	t.true(wrapper.html().includes(`<p>${t.title}2</p>`));
});

test("renders nothing when invalid", (t) => {
	const consoleErrorStub = sinon.stub(console, "error");

	const wrapper = mount(PrismicRichText, {
		propsData: { field: null },
	});

	t.is(wrapper.html(), "");
	t.is(
		consoleErrorStub.withArgs(
			sinon.match(/Invalid prop: type check failed for prop/i),
		).callCount,
		1,
	);
	t.is(consoleErrorStub.callCount, 1);

	consoleErrorStub.restore();
});

test("reacts to changes properly", async (t) => {
	const localVue = createLocalVue();
	const PrismicRichTextProxy = localVue.component("PrismicRichTextProxy", {
		name: "PrismicRichTextProxy",
		props: {
			field: {
				type: Array,
				required: true,
			},
		},
		render(h) {
			return h(PrismicRichTextImpl, {
				props: {
					field: this.field,
				},
			});
		},
	});

	const wrapper = mount(PrismicRichTextProxy, {
		propsData: { field: richTextFixture.en },
	});

	const firstRender = wrapper.html();

	await wrapper.setProps({
		field: [{ type: "paragraph", text: "foo", spans: [] }],
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
