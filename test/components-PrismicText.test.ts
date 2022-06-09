import test from "ava";
import { mount } from "@vue/test-utils";

import { markRaw } from "vue";
import { RichTextField } from "@prismicio/types";

import { richTextFixture } from "./__fixtures__/richText";
import { WrapperComponent } from "./__fixtures__/WrapperComponent";

import { PrismicTextImpl } from "../src/components";

test("renders rich text field as plain text", (t) => {
	const wrapper = mount(PrismicTextImpl, {
		props: { field: richTextFixture.en },
	});

	t.snapshot(wrapper.html());
});

test("renders fallback when rich text is empty", (t) => {
	const wrapper1 = mount(PrismicTextImpl, {
		props: { field: [] },
	});

	t.is(wrapper1.html(), "<div></div>");

	const wrapper2 = mount(PrismicTextImpl, {
		props: { field: [], fallback: "foo" },
	});

	t.is(wrapper2.html(), "<div>foo</div>");

	const wrapper3 = mount(PrismicTextImpl, {
		props: { field: null, fallback: "bar" },
	});

	t.is(wrapper3.html(), "<div>bar</div>");

	const wrapper4 = mount(PrismicTextImpl, {
		props: { field: undefined, fallback: "baz" },
	});

	t.is(wrapper4.html(), "<div>baz</div>");
});

test("uses provided wrapper tag", (t) => {
	const wrapper = mount(PrismicTextImpl, {
		props: { field: richTextFixture.en, wrapper: "p" },
	});

	t.snapshot(wrapper.html());
});

test("uses provided wrapper component", (t) => {
	const wrapper = mount(PrismicTextImpl, {
		props: { field: richTextFixture.en, wrapper: markRaw(WrapperComponent) },
	});

	t.snapshot(wrapper.html());
});

test("reacts to changes properly", async (t) => {
	const wrapper = mount(PrismicTextImpl, {
		props: { field: richTextFixture.en },
	});

	const firstRender = wrapper.html();

	await wrapper.setProps({
		field: [{ type: "paragraph", text: "foo", spans: [] }] as RichTextField,
	});

	const secondRender = wrapper.html();

	t.not(secondRender, firstRender);
	t.is(secondRender, "<div>foo</div>");
});
