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

test("renders image field with an accessible default alt value", (t) => {
	const wrapper = mount(PrismicImageImpl, {
		props: { field: { ...mock.value.image({ seed: 2 }), alt: null } },
	});

	t.snapshot(wrapper.html());
});

test("renders image field with imgix URL parameters", (t) => {
	const wrapper = mount(PrismicImageImpl, {
		props: {
			field: mock.value.image({ seed: 3 }),
			imgixParams: { sat: 100 },
		},
	});

	t.snapshot(wrapper.html());
});

test("renders image field with width-based `srcset`", (t) => {
	const wrapper = mount(PrismicImageImpl, {
		props: {
			field: mock.value.image({ seed: 4 }),
			imgixParams: { sat: 100 },
			widths: [100, 200, 300],
		},
	});

	t.snapshot(wrapper.html());
});

test("renders image field with auto width-based `srcset`", (t) => {
	const wrapper = mount(PrismicImageImpl, {
		props: {
			field: {
				...mock.value.image({ seed: 5 }),
				foo: mock.value.image({ seed: 6 }),
				bar: mock.value.image({ seed: 7 }),
				baz: mock.value.image({ seed: 8 }),
			},
			imgixParams: { sat: 100 },
			widths: "auto",
		},
	});

	t.snapshot(wrapper.html());
});

test("renders image field with defaults width-based `srcset`", (t) => {
	const wrapper = mount(PrismicImageImpl, {
		props: {
			field: mock.value.image({ seed: 9 }),
			imgixParams: { sat: 100 },
			widths: "defaults",
		},
	});

	t.snapshot(wrapper.html());
});

test("renders image field with plugin defaults width-based `srcset`", (t) => {
	const prismic = createPrismic({
		endpoint: "test",
		components: {
			imageWidthSrcSetDefaults: [400, 500, 600],
		},
	});

	const wrapper = mount(PrismicImageImpl, {
		props: {
			field: mock.value.image({ seed: 10 }),
			imgixParams: { sat: 100 },
			widths: "defaults",
		},
		global: { plugins: [prismic] },
	});

	t.snapshot(wrapper.html());
});

test("renders image field with pixel-density-based `srcset`", (t) => {
	const wrapper = mount(PrismicImageImpl, {
		props: {
			field: mock.value.image({ seed: 11 }),
			imgixParams: { sat: 100 },
			pixelDensities: [1, 2],
		},
	});

	t.snapshot(wrapper.html());
});

test("renders image field with defaults pixel-density-based `srcset`", (t) => {
	const wrapper = mount(PrismicImageImpl, {
		props: {
			field: mock.value.image({ seed: 12 }),
			imgixParams: { sat: 100 },
			pixelDensities: "defaults",
		},
	});

	t.snapshot(wrapper.html());
});

test("renders image field with plugin defaults pixel-density-based `srcset`", (t) => {
	const prismic = createPrismic({
		endpoint: "test",
		components: {
			imagePixelDensitySrcSetDefaults: [3, 4],
		},
	});

	const wrapper = mount(PrismicImageImpl, {
		props: {
			field: mock.value.image({ seed: 13 }),
			imgixParams: { sat: 100 },
			pixelDensities: "defaults",
		},
		global: { plugins: [prismic] },
	});

	t.snapshot(wrapper.html());
});

test("renders image field using width-based over pixel-density-based `srcset` and warns user", (t) => {
	const consoleWarnStub = sinon.stub(console, "warn");

	const wrapper = mount(PrismicImageImpl, {
		props: {
			field: mock.value.image({ seed: 14 }),
			imgixParams: { sat: 100 },
			widths: "defaults",
			pixelDensities: "defaults",
		},
	});

	t.snapshot(wrapper.html());
	t.is(
		consoleWarnStub.withArgs(
			sinon.match(
				/\[PrismicImage\] `widths` and `pixelDensities` props should not be use alongside each others, only `widths` will be applied/i,
			),
		).callCount,
		1,
	);
	t.is(consoleWarnStub.callCount, 1);
	consoleWarnStub.restore();
});

test("renders partial image field", (t) => {
	const wrapper = mount(PrismicImageImpl, {
		props: {
			field: {
				...mock.value.image({ seed: 15 }),
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
			field: mock.value.image({ seed: 16 }),
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
			field: mock.value.image({ seed: 17 }),
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
				...mock.value.image({ seed: 18 }),
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
		props: { field: mock.value.image({ seed: 19 }) },
	});

	const firstRender = wrapper.html();

	await wrapper.setProps({
		field: mock.value.image({ seed: 20 }),
	});

	const secondRender = wrapper.html();

	t.not(secondRender, firstRender);
	t.snapshot(secondRender);
});
