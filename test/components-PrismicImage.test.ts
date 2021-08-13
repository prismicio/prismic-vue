import test from "ava";
import * as sinon from "sinon";
import { mount } from "@vue/test-utils";
import * as mock from "@prismicio/mock";

import { markRaw } from "vue";
import { ImageField } from "@prismicio/types";

import {
	createWrapperComponent,
	WrapperComponent,
} from "./__fixtures__/WrapperComponent";

import { PrismicImageImpl } from "../src/components";
import { createPrismic } from "../src";

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

test("uses plugin provided image component", (t) => {
	const prismic = createPrismic({
		endpoint: "test",
		components: {
			imageComponent: WrapperComponent,
		},
	});

	const wrapper = mount(PrismicImageImpl, {
		props: {
			field: mock.value.image({ seed: 3 }),
		},
		global: { plugins: [prismic] },
	});

	t.snapshot(wrapper.html());
});

test("uses provided image component over plugin provided", (t) => {
	const prismic = createPrismic({
		endpoint: "test",
		components: {
			imageComponent: createWrapperComponent(1),
		},
	});

	const wrapper = mount(PrismicImageImpl, {
		props: {
			field: mock.value.image({ seed: 3 }),
			imageComponent: markRaw(createWrapperComponent(2)),
		},
		global: { plugins: [prismic] },
	});

	t.snapshot(wrapper.html());
});

test("renders partial image field with image component", (t) => {
	const wrapper = mount(PrismicImageImpl, {
		props: {
			field: {
				...mock.value.image({ seed: 4 }),
				url: null,
				alt: null,
				copyright: null,
			} as ImageField,
			imageComponent: markRaw(WrapperComponent),
		},
	});

	t.snapshot(wrapper.html());
});

test("renders nothing when invalid", (t) => {
	const consoleWarnStub = sinon.stub(console, "warn");

	const wrapper = mount(PrismicImageImpl, {
		props: { field: null as unknown as ImageField },
	});

	t.is(wrapper.html(), "<!---->");
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
	const wrapper = mount(PrismicImageImpl, {
		props: { field: mock.value.image({ seed: 5 }) },
	});

	const firstRender = wrapper.html();

	await wrapper.setProps({
		field: mock.value.image({ seed: 6 }),
	});

	const secondRender = wrapper.html();

	t.not(secondRender, firstRender);
	t.snapshot(secondRender);
});
