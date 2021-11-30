import test from "ava";
import * as sinon from "sinon";
import { mount, createLocalVue } from "@vue/test-utils";
import * as mock from "@prismicio/mock";

import Vue from "vue";

import { WrapperComponent } from "./__fixtures__/WrapperComponent";

import PrismicEmbedImpl from "../src/components/Embed";

const PrismicEmbed = Vue.component("PrismicEmbed", PrismicEmbedImpl);

test("renders embed field", (t) => {
	const wrapper = mount(PrismicEmbed, {
		propsData: { field: mock.value.embed({ seed: 1 }) },
	});

	t.snapshot(wrapper.html());
});

test("renders embed field with no HTML", (t) => {
	const wrapper = mount(PrismicEmbed, {
		propsData: {
			field: {
				...mock.value.embed({ seed: 2 }),
				html: null,
			},
		},
	});

	t.snapshot(wrapper.html());
});

test("uses provided wrapper tag", (t) => {
	const wrapper = mount(PrismicEmbed, {
		propsData: { field: mock.value.embed({ seed: 3 }), wrapper: "section" },
	});

	t.snapshot(wrapper.html());
});

test("uses provided wrapper component", (t) => {
	const wrapper = mount(PrismicEmbed, {
		propsData: {
			field: mock.value.embed({ seed: 4 }),
			wrapper: WrapperComponent,
		},
	});

	t.snapshot(wrapper.html());
});

test("renders nothing when invalid", (t) => {
	const consoleErrorStub = sinon.stub(console, "error");

	const wrapper = mount(PrismicEmbed, {
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
	const PrismicEmbedProxy = localVue.component("PrismicEmbedProxy", {
		name: "PrismicEmbedProxy",
		props: {
			field: {
				type: Object,
				required: true,
			},
		},
		render(h) {
			return h(PrismicEmbedImpl, {
				props: {
					field: this.field,
				},
			});
		},
	});

	const wrapper = mount(PrismicEmbedProxy, {
		propsData: { field: mock.value.embed({ seed: 5 }) },
	});

	const firstRender = wrapper.html();

	await wrapper.setProps({
		field: mock.value.embed({ seed: 6 }),
	});

	const secondRender = wrapper.html();

	t.not(secondRender, firstRender);
	t.snapshot(secondRender);
});
