import test from "ava";
import { mount } from "@vue/test-utils";
import * as mock from "@prismicio/mock";

import { markRaw } from "vue";
import { ImageField } from "@prismicio/types";

import { WrapperComponent } from "./__fixtures__/WrapperComponent";

import { PrismicImageImpl } from "../src/components";

test("renders image field", (t) => {
	const wrapper = mount(PrismicImageImpl, {
		props: { field: mock.value.image({ seed: 1 }) },
	});

	t.snapshot(wrapper.html());
});

test("renders partial image field", (t) => {
	const wrapper = mount(PrismicImageImpl, {
		props: {
			field: {
				...mock.value.image({ seed: 2 }),
				url: null,
				alt: null,
				copyright: null,
			} as ImageField,
		},
	});

	t.snapshot(wrapper.html());
});

test("uses provided image component", (t) => {
	const wrapper = mount(PrismicImageImpl, {
		props: {
			field: mock.value.image({ seed: 3 }),
			imageComponent: markRaw(WrapperComponent),
		},
	});

	t.snapshot(wrapper.html());
});

test("renders nothing when invalid", (t) => {
	const wrapper = mount(PrismicImageImpl, {
		props: { field: null as unknown as ImageField },
	});

	t.is(wrapper.html(), "<!---->");
});

test("reacts to changes properly", async (t) => {
	const wrapper = mount(PrismicImageImpl, {
		props: { field: mock.value.image({ seed: 4 }) },
	});

	const firstRender = wrapper.html();

	await wrapper.setProps({
		field: mock.value.image({ seed: 5 }),
	});

	const secondRender = wrapper.html();

	t.not(secondRender, firstRender);
	t.snapshot(secondRender);
});
