import { it, expect } from "vitest";
import { mount } from "@vue/test-utils";

import { markRaw } from "vue";
import { RichTextField } from "@prismicio/types";

import { richTextFixture } from "./__fixtures__/richText";
import { WrapperComponent } from "./__fixtures__/WrapperComponent";

import { PrismicTextImpl } from "../src/components";

it("renders rich text field as plain text", () => {
	const wrapper = mount(PrismicTextImpl, {
		props: { field: richTextFixture.en },
	});

	expect(wrapper.html()).toMatchSnapshot();
});

it("renders fallback when rich text is empty", () => {
	const wrapper1 = mount(PrismicTextImpl, {
		props: { field: [] },
	});

	expect(wrapper1.html()).toBe("<div></div>");

	const wrapper2 = mount(PrismicTextImpl, {
		props: { field: [], fallback: "foo" },
	});

	expect(wrapper2.html()).toBe("<div>foo</div>");

	const wrapper3 = mount(PrismicTextImpl, {
		props: { field: null, fallback: "bar" },
	});

	expect(wrapper3.html()).toBe("<div>bar</div>");

	const wrapper4 = mount(PrismicTextImpl, {
		props: { field: undefined, fallback: "baz" },
	});

	expect(wrapper4.html()).toBe("<div>baz</div>");
});

it("uses provided wrapper tag", () => {
	const wrapper = mount(PrismicTextImpl, {
		props: { field: richTextFixture.en, wrapper: "p" },
	});

	expect(wrapper.html()).toMatchSnapshot();
});

it("uses provided wrapper component", () => {
	const wrapper = mount(PrismicTextImpl, {
		props: { field: richTextFixture.en, wrapper: markRaw(WrapperComponent) },
	});

	expect(wrapper.html()).toMatchSnapshot();
});

it("reacts to changes properly", async () => {
	const wrapper = mount(PrismicTextImpl, {
		props: { field: richTextFixture.en },
	});

	const firstRender = wrapper.html();

	await wrapper.setProps({
		field: [{ type: "paragraph", text: "foo", spans: [] }] as RichTextField,
	});

	const secondRender = wrapper.html();

	expect(secondRender).not.toBe(firstRender);
	expect(secondRender).toBe("<div>foo</div>");
});
