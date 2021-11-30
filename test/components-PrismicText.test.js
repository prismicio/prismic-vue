import test from "ava";
import * as sinon from "sinon";
import { mount, createLocalVue } from "@vue/test-utils";

import Vue from "vue";

import { richTextFixture } from "./__fixtures__/richText";
import { WrapperComponent } from "./__fixtures__/WrapperComponent";

import PrismicTextImpl from "../src/components/Text";

const PrismicText = Vue.component("PrismicRichText", PrismicTextImpl);

test("renders rich text field as plain text", (t) => {
	const wrapper = mount(PrismicText, {
		propsData: { field: richTextFixture.en },
	});

	t.snapshot(wrapper.html());
});

test("uses provided wrapper tag", (t) => {
	const wrapper = mount(PrismicText, {
		propsData: { field: richTextFixture.en, wrapper: "p" },
	});

	t.snapshot(wrapper.html());
});

test("uses provided wrapper component", (t) => {
	const wrapper = mount(PrismicText, {
		propsData: { field: richTextFixture.en, wrapper: WrapperComponent },
	});

	t.snapshot(wrapper.html());
});

test("renders nothing when invalid", (t) => {
	const consoleErrorStub = sinon.stub(console, "error");
	const wrapper = mount(PrismicText, {
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
	const PrismicTextProxy = localVue.component("PrismicTextProxy", {
		name: "PrismicTextProxy",
		props: {
			field: {
				type: Array,
				required: true,
			},
		},
		render(h) {
			return h(PrismicTextImpl, {
				props: {
					field: this.field,
				},
			});
		},
	});

	const wrapper = mount(PrismicTextProxy, {
		propsData: { field: richTextFixture.en },
	});

	const firstRender = wrapper.html();

	await wrapper.setProps({
		field: [{ type: "paragraph", text: "foo", spans: [] }],
	});

	const secondRender = wrapper.html();

	t.not(secondRender, firstRender);
	t.is(secondRender, "<div>foo</div>");
});
