import test from "ava";
import * as sinon from "sinon";
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

test("renders nothing when invalid", (t) => {
	const consoleWarnStub = sinon.stub(console, "warn");
	const wrapper = mount(PrismicTextImpl, {
		props: { field: null as unknown as RichTextField },
	});

	t.is(wrapper.html(), "");
	t.is(
		consoleWarnStub.withArgs(
			sinon.match(/Invalid prop: type check failed for prop/i),
		).callCount,
		1,
	);
	t.is(consoleWarnStub.callCount, 1);
	consoleWarnStub.restore();
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
