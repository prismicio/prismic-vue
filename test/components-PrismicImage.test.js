import test from "ava";
import * as sinon from "sinon";
import { mount, createLocalVue } from "@vue/test-utils";
import * as mock from "@prismicio/mock";

import Vue from "vue";

import PrismicImageImpl from "../src/components/Image";

const PrismicImage = Vue.component("PrismicImage", PrismicImageImpl);

test("renders image field", (t) => {
	const wrapper = mount(PrismicImage, {
		propsData: { field: mock.value.image({ seed: 1 }) },
	});

	t.snapshot(wrapper.html());
});

test("renders image field with an accessible default alt value", (t) => {
	const wrapper = mount(PrismicImage, {
		propsData: { field: { ...mock.value.image({ seed: 2 }), alt: null } },
	});

	t.snapshot(wrapper.html());
});

test("renders partial image field", (t) => {
	const wrapper = mount(PrismicImage, {
		propsData: {
			field: {
				...mock.value.image({ seed: 3 }),
				url: null,
				alt: null,
				copyright: null,
			},
		},
	});

	t.snapshot(wrapper.html());
});

test("renders nothing when invalid", (t) => {
	const consoleErrorStub = sinon.stub(console, "error");

	const wrapper = mount(PrismicImage, {
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
	const PrismicImageProxy = localVue.component("PrismicImageProxy", {
		name: "PrismicImageProxy",
		props: {
			field: {
				type: Object,
				required: true,
			},
		},
		render(h) {
			return h(PrismicImageImpl, {
				props: {
					field: this.field,
				},
			});
		},
	});

	const wrapper = mount(PrismicImageProxy, {
		propsData: { field: mock.value.image({ seed: 4 }) },
	});

	const firstRender = wrapper.html();

	await wrapper.setProps({
		field: mock.value.image({ seed: 5 }),
	});

	const secondRender = wrapper.html();

	t.not(secondRender, firstRender);
	t.snapshot(secondRender);
});
