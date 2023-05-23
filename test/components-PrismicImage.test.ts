import { expect, it, vi } from "vitest";

import * as mock from "@prismicio/mock";
import { mount } from "@vue/test-utils";
import { markRaw } from "vue";

import {
	WrapperComponent,
	createWrapperComponent,
} from "./__fixtures__/WrapperComponent";

import { ImageField } from "@prismicio/types";

import { createPrismic } from "../src";
import { PrismicImageImpl } from "../src/components";

it("renders image field", () => {
	const wrapper = mount(PrismicImageImpl, {
		props: { field: mock.value.image({ seed: 1 }) },
	});

	expect(wrapper.html()).toMatchInlineSnapshot(
		'"<img src=\\"https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=5616&amp;h=3744&amp;fit=crop\\" alt=\\"Quis eleifend quam adipiscing vitae proin sagittis nisl rhoncus mattis rhoncus urna\\">"',
	);
});

it("renders image field with an accessible default alt value", () => {
	const wrapper = mount(PrismicImageImpl, {
		props: { field: { ...mock.value.image({ seed: 2 }), alt: null } },
	});

	expect(wrapper.html()).toMatchInlineSnapshot(
		'"<img src=\\"https://images.unsplash.com/photo-1604537529428-15bcbeecfe4d?w=4240&amp;h=2832&amp;fit=crop\\" alt=\\"\\">"',
	);
});

it("renders image field with provided alt value", () => {
	const wrapper = mount(PrismicImageImpl, {
		props: { field: { ...mock.value.image({ seed: 2 }), alt: "foo" } },
		attrs: {
			alt: "bar",
		},
	});

	expect(wrapper.html()).toMatchInlineSnapshot(
		'"<img src=\\"https://images.unsplash.com/photo-1604537529428-15bcbeecfe4d?w=4240&amp;h=2832&amp;fit=crop\\" alt=\\"bar\\">"',
	);
});

it("renders image field with imgix URL parameters", () => {
	const wrapper = mount(PrismicImageImpl, {
		props: {
			field: mock.value.image({ seed: 3 }),
			imgixParams: { sat: 100 },
		},
	});

	expect(wrapper.html()).toMatchInlineSnapshot(
		'"<img src=\\"https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=2560&amp;h=1440&amp;fit=crop&amp;sat=100\\" alt=\\"In cursus turpis massa tincidunt dui ut ornare lectus sit amet est placerat\\">"',
	);
});

it("renders image field with width-based `srcset`", () => {
	const wrapper = mount(PrismicImageImpl, {
		props: {
			field: mock.value.image({ seed: 4 }),
			imgixParams: { sat: 100 },
			widths: [100, 200, 300],
		},
	});

	expect(wrapper.html()).toMatchInlineSnapshot(
		'"<img src=\\"https://images.unsplash.com/reserve/HgZuGu3gSD6db21T3lxm_San%20Zenone.jpg?w=6373&amp;h=4253&amp;fit=crop&amp;sat=100\\" srcset=\\"https://images.unsplash.com/reserve/HgZuGu3gSD6db21T3lxm_San%20Zenone.jpg?h=4253&amp;fit=crop&amp;sat=100&amp;width=100 100w, https://images.unsplash.com/reserve/HgZuGu3gSD6db21T3lxm_San%20Zenone.jpg?h=4253&amp;fit=crop&amp;sat=100&amp;width=200 200w, https://images.unsplash.com/reserve/HgZuGu3gSD6db21T3lxm_San%20Zenone.jpg?h=4253&amp;fit=crop&amp;sat=100&amp;width=300 300w\\" alt=\\"Aliquam etiam erat velit scelerisque in dictum non consectetur a erat\\">"',
	);
});

it("renders image field with thumbnails width-based `srcset`", () => {
	const wrapper = mount(PrismicImageImpl, {
		props: {
			field: {
				...mock.value.image({ seed: 5 }),
				foo: mock.value.image({ seed: 6 }),
				bar: mock.value.image({ seed: 7 }),
				baz: mock.value.image({ seed: 8 }),
			},
			imgixParams: { sat: 100 },
			widths: "thumbnails",
		},
	});

	expect(wrapper.html()).toMatchInlineSnapshot(
		'"<img src=\\"https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=7372&amp;h=4392&amp;fit=crop&amp;sat=100\\" srcset=\\"https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?h=4392&amp;fit=crop&amp;sat=100&amp;width=7372 7372w, https://images.unsplash.com/photo-1604537466608-109fa2f16c3b?h=2832&amp;fit=crop&amp;sat=100&amp;width=4240 4240w, https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?h=1467&amp;fit=crop&amp;sat=100&amp;width=2200 2200w, https://images.unsplash.com/photo-1504198266287-1659872e6590?h=2848&amp;fit=crop&amp;sat=100&amp;width=4272 4272w\\" alt=\\"Enim facilisis gravida neque convallis a cras semper auctor\\">"',
	);
});

it("renders image field with defaults width-based `srcset`", () => {
	const wrapper = mount(PrismicImageImpl, {
		props: {
			field: mock.value.image({ seed: 9 }),
			imgixParams: { sat: 100 },
			widths: "defaults",
		},
	});

	expect(wrapper.html()).toMatchInlineSnapshot(
		'"<img src=\\"https://images.unsplash.com/photo-1444464666168-49d633b86797?w=4844&amp;h=3234&amp;fit=crop&amp;sat=100\\" srcset=\\"https://images.unsplash.com/photo-1444464666168-49d633b86797?h=3234&amp;fit=crop&amp;sat=100&amp;width=640 640w, https://images.unsplash.com/photo-1444464666168-49d633b86797?h=3234&amp;fit=crop&amp;sat=100&amp;width=828 828w, https://images.unsplash.com/photo-1444464666168-49d633b86797?h=3234&amp;fit=crop&amp;sat=100&amp;width=1200 1200w, https://images.unsplash.com/photo-1444464666168-49d633b86797?h=3234&amp;fit=crop&amp;sat=100&amp;width=2048 2048w, https://images.unsplash.com/photo-1444464666168-49d633b86797?h=3234&amp;fit=crop&amp;sat=100&amp;width=3840 3840w\\" alt=\\"Faucibus et molestie ac feugiat sed lectus\\">"',
	);
});

it("renders image field with plugin defaults width-based `srcset`", () => {
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

	expect(wrapper.html()).toMatchInlineSnapshot(
		'"<img src=\\"https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=5616&amp;h=3744&amp;fit=crop&amp;sat=100\\" srcset=\\"https://images.unsplash.com/photo-1426604966848-d7adac402bff?h=3744&amp;fit=crop&amp;sat=100&amp;width=400 400w, https://images.unsplash.com/photo-1426604966848-d7adac402bff?h=3744&amp;fit=crop&amp;sat=100&amp;width=500 500w, https://images.unsplash.com/photo-1426604966848-d7adac402bff?h=3744&amp;fit=crop&amp;sat=100&amp;width=600 600w\\" alt=\\"Pulvinar proin gravida hendrerit lectus a molestie\\">"',
	);
});

it("renders image field with pixel-density-based `srcset`", () => {
	const wrapper = mount(PrismicImageImpl, {
		props: {
			field: mock.value.image({ seed: 11 }),
			imgixParams: { sat: 100 },
			pixelDensities: [1, 2],
		},
	});

	expect(wrapper.html()).toMatchInlineSnapshot(
		'"<img src=\\"https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=2560&amp;h=1705&amp;fit=crop&amp;sat=100\\" srcset=\\"https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=2560&amp;h=1705&amp;fit=crop&amp;sat=100&amp;dpr=1 1x, https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=2560&amp;h=1705&amp;fit=crop&amp;sat=100&amp;dpr=2 2x\\" alt=\\"Dictum varius duis at consectetur lorem donec massa sapien faucibus et\\">"',
	);
});

it("renders image field with defaults pixel-density-based `srcset`", () => {
	const wrapper = mount(PrismicImageImpl, {
		props: {
			field: mock.value.image({ seed: 12 }),
			imgixParams: { sat: 100 },
			pixelDensities: "defaults",
		},
	});

	expect(wrapper.html()).toMatchInlineSnapshot(
		'"<img src=\\"https://images.unsplash.com/photo-1444464666168-49d633b86797?w=4844&amp;h=3234&amp;fit=crop&amp;sat=100\\" srcset=\\"https://images.unsplash.com/photo-1444464666168-49d633b86797?w=4844&amp;h=3234&amp;fit=crop&amp;sat=100&amp;dpr=1 1x, https://images.unsplash.com/photo-1444464666168-49d633b86797?w=4844&amp;h=3234&amp;fit=crop&amp;sat=100&amp;dpr=2 2x, https://images.unsplash.com/photo-1444464666168-49d633b86797?w=4844&amp;h=3234&amp;fit=crop&amp;sat=100&amp;dpr=3 3x\\" alt=\\"Suscipit tellus mauris a diam maecenas sed enim\\">"',
	);
});

it("renders image field with plugin defaults pixel-density-based `srcset`", () => {
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

	expect(wrapper.html()).toMatchInlineSnapshot(
		'"<img src=\\"https://images.unsplash.com/photo-1504198266287-1659872e6590?w=4272&amp;h=2848&amp;fit=crop&amp;sat=100\\" srcset=\\"https://images.unsplash.com/photo-1504198266287-1659872e6590?w=4272&amp;h=2848&amp;fit=crop&amp;sat=100&amp;dpr=3 3x, https://images.unsplash.com/photo-1504198266287-1659872e6590?w=4272&amp;h=2848&amp;fit=crop&amp;sat=100&amp;dpr=4 4x\\" alt=\\"Enim diam vulputate ut pharetra sit amet aliquam id diam\\">"',
	);
});

it("renders image field using width-based over pixel-density-based `srcset` and warns user", () => {
	vi.stubGlobal("console", { warn: vi.fn() });

	const wrapper = mount(PrismicImageImpl, {
		props: {
			field: mock.value.image({ seed: 14 }),
			imgixParams: { sat: 100 },
			widths: "defaults",
			pixelDensities: "defaults",
		},
	});

	expect(wrapper.html()).toMatchInlineSnapshot(
		'"<img src=\\"https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?w=6000&amp;h=4000&amp;fit=crop&amp;sat=100\\" srcset=\\"https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?h=4000&amp;fit=crop&amp;sat=100&amp;width=640 640w, https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?h=4000&amp;fit=crop&amp;sat=100&amp;width=828 828w, https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?h=4000&amp;fit=crop&amp;sat=100&amp;width=1200 1200w, https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?h=4000&amp;fit=crop&amp;sat=100&amp;width=2048 2048w, https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?h=4000&amp;fit=crop&amp;sat=100&amp;width=3840 3840w\\" alt=\\"Suspendisse in est ante in nibh\\">"',
	);
	expect(console.warn).toHaveBeenCalledOnce();
	expect(vi.mocked(console.warn).mock.calls[0]).toMatch(
		/\[PrismicImage\] Only one of `widths` or `pixelDensities`/i,
	);

	vi.resetAllMocks();
});

it("renders partial image field", () => {
	const wrapper = mount(PrismicImageImpl, {
		props: {
			field: {
				...mock.value.image({ seed: 15 }),
				url: null,
				alt: null,
				copyright: null,
			} as unknown as ImageField,
		},
	});

	expect(wrapper.html()).toMatchInlineSnapshot('"<img alt=\\"\\">"');
});

it("uses plugin provided image component", () => {
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

	expect(wrapper.html()).toMatchInlineSnapshot(
		'"<div class=\\"wrapperComponent\\" src=\\"https://images.unsplash.com/photo-1431794062232-2a99a5431c6c?w=6000&amp;h=4000&amp;fit=crop\\" alt=\\"In fermentum posuere urna nec tincidunt praesent semper feugiat nibh\\" copyright=\\"Massa tincidunt dui ut ornare lectus sit amet est placerat in\\"></div>"',
	);
});

it("uses provided image component over plugin provided", () => {
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

	expect(wrapper.html()).toMatchInlineSnapshot(
		'"<div class=\\"wrapperComponent2\\" src=\\"https://images.unsplash.com/photo-1504567961542-e24d9439a724?w=4608&amp;h=3456&amp;fit=crop\\" alt=\\"Molestie ac feugiat sed lectus vestibulum mattis\\" copyright=\\"Diam vulputate ut pharetra sit amet aliquam id diam maecenas ultricies mi eget\\"></div>"',
	);
});

it("renders partial image field with image component", () => {
	const wrapper = mount(PrismicImageImpl, {
		props: {
			field: {
				...mock.value.image({ seed: 18 }),
				url: null,
				alt: null,
				copyright: null,
			} as unknown as ImageField,
			imageComponent: markRaw(WrapperComponent),
		},
	});

	expect(wrapper.html()).toMatchInlineSnapshot(
		'"<div class=\\"wrapperComponent\\" alt=\\"\\"></div>"',
	);
});

it("renders nothing when invalid", () => {
	vi.stubGlobal("console", { warn: vi.fn() });

	const wrapper = mount(PrismicImageImpl, {
		props: { field: null as unknown as ImageField },
	});

	expect(wrapper.html()).toBe("");
	expect(console.warn).toHaveBeenCalledOnce();
	expect(vi.mocked(console.warn).mock.calls[0]).toMatch(
		/Invalid prop: type check failed for prop/i,
	);

	vi.resetAllMocks();
});

it("reacts to changes properly", async () => {
	const wrapper = mount(PrismicImageImpl, {
		props: { field: mock.value.image({ seed: 19 }) },
	});

	const firstRender = wrapper.html();

	await wrapper.setProps({
		field: mock.value.image({ seed: 20 }),
	});

	const secondRender = wrapper.html();

	expect(secondRender).not.toBe(firstRender);
	expect(secondRender).toMatchInlineSnapshot(
		'"<img src=\\"https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=2560&amp;h=1440&amp;fit=crop\\" alt=\\"Amet nisl suscipit adipiscing bibendum est\\">"',
	);
});
