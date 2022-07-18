import { it, expect, vi } from "vitest";
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

it("renders image field", () => {
	const wrapper = mount(PrismicImageImpl, {
		props: { field: mock.value.image({ seed: 1 }) },
	});

	expect(wrapper.html()).toMatchInlineSnapshot(
		'"<img src=\\"https://images.unsplash.com/reserve/HgZuGu3gSD6db21T3lxm_San%20Zenone.jpg?w=6373&amp;h=4253&amp;fit=crop\\" alt=\\"Orci ac auctor augue mauris augue neque gravida\\">"',
	);
});

it("renders image field with an accessible default alt value", () => {
	const wrapper = mount(PrismicImageImpl, {
		props: { field: { ...mock.value.image({ seed: 2 }), alt: null } },
	});

	expect(wrapper.html()).toMatchInlineSnapshot(
		'"<img src=\\"https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=4554&amp;h=3036&amp;fit=crop\\" alt=\\"\\">"',
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
		'"<img src=\\"https://images.unsplash.com/reserve/HgZuGu3gSD6db21T3lxm_San%20Zenone.jpg?w=6373&amp;h=4253&amp;fit=crop\\" alt=\\"bar\\">"',
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
		'"<img src=\\"https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=2560&amp;h=1440&amp;fit=crop&amp;sat=100\\" alt=\\"Volutpat maecenas volutpat blandit aliquam etiam erat velit scelerisque in dictum non consectetur a\\">"',
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
		'"<img src=\\"https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?w=6000&amp;h=4000&amp;fit=crop&amp;sat=100\\" srcset=\\"https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?h=4000&amp;fit=crop&amp;sat=100&amp;width=100 100w, https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?h=4000&amp;fit=crop&amp;sat=100&amp;width=200 200w, https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?h=4000&amp;fit=crop&amp;sat=100&amp;width=300 300w\\" alt=\\"Pulvinar sapien et ligula ullamcorper malesuada proin libero nunc consequat interdum\\">"',
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
		'"<img src=\\"https://images.unsplash.com/reserve/HgZuGu3gSD6db21T3lxm_San%20Zenone.jpg?w=6373&amp;h=4253&amp;fit=crop&amp;sat=100\\" srcset=\\"https://images.unsplash.com/reserve/HgZuGu3gSD6db21T3lxm_San%20Zenone.jpg?h=4253&amp;fit=crop&amp;sat=100&amp;width=6373 6373w, https://images.unsplash.com/photo-1504198266287-1659872e6590?h=2848&amp;fit=crop&amp;sat=100&amp;width=4272 4272w, https://images.unsplash.com/reserve/HgZuGu3gSD6db21T3lxm_San%20Zenone.jpg?h=4253&amp;fit=crop&amp;sat=100&amp;width=6373 6373w, https://images.unsplash.com/photo-1426604966848-d7adac402bff?h=3744&amp;fit=crop&amp;sat=100&amp;width=5616 5616w\\" alt=\\"Amet massa vitae tortor condimentum lacinia quis vel eros donec\\">"',
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
		'"<img src=\\"https://images.unsplash.com/photo-1553531384-397c80973a0b?w=4335&amp;h=6502&amp;fit=crop&amp;sat=100\\" srcset=\\"https://images.unsplash.com/photo-1553531384-397c80973a0b?h=6502&amp;fit=crop&amp;sat=100&amp;width=640 640w, https://images.unsplash.com/photo-1553531384-397c80973a0b?h=6502&amp;fit=crop&amp;sat=100&amp;width=828 828w, https://images.unsplash.com/photo-1553531384-397c80973a0b?h=6502&amp;fit=crop&amp;sat=100&amp;width=1200 1200w, https://images.unsplash.com/photo-1553531384-397c80973a0b?h=6502&amp;fit=crop&amp;sat=100&amp;width=2048 2048w, https://images.unsplash.com/photo-1553531384-397c80973a0b?h=6502&amp;fit=crop&amp;sat=100&amp;width=3840 3840w\\" alt=\\"Adipiscing enim eu turpis egestas pretium aenean pharetra magna ac placerat vestibulum\\">"',
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
		'"<img src=\\"https://images.unsplash.com/photo-1604537529428-15bcbeecfe4d?w=4240&amp;h=2832&amp;fit=crop&amp;sat=100\\" srcset=\\"https://images.unsplash.com/photo-1604537529428-15bcbeecfe4d?h=2832&amp;fit=crop&amp;sat=100&amp;width=400 400w, https://images.unsplash.com/photo-1604537529428-15bcbeecfe4d?h=2832&amp;fit=crop&amp;sat=100&amp;width=500 500w, https://images.unsplash.com/photo-1604537529428-15bcbeecfe4d?h=2832&amp;fit=crop&amp;sat=100&amp;width=600 600w\\" alt=\\"Nisl condimentum id venenatis a condimentum vitae\\">"',
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
		'"<img src=\\"https://images.unsplash.com/reserve/HgZuGu3gSD6db21T3lxm_San%20Zenone.jpg?w=6373&amp;h=4253&amp;fit=crop&amp;sat=100\\" srcset=\\"https://images.unsplash.com/reserve/HgZuGu3gSD6db21T3lxm_San%20Zenone.jpg?w=6373&amp;h=4253&amp;fit=crop&amp;sat=100&amp;dpr=1 1x, https://images.unsplash.com/reserve/HgZuGu3gSD6db21T3lxm_San%20Zenone.jpg?w=6373&amp;h=4253&amp;fit=crop&amp;sat=100&amp;dpr=2 2x\\" alt=\\"Fermentum odio eu feugiat pretium nibh ipsum consequat nisl vel pretium lectus quam\\">"',
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
		'"<img src=\\"https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?w=6000&amp;h=4000&amp;fit=crop&amp;sat=100\\" srcset=\\"https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?w=6000&amp;h=4000&amp;fit=crop&amp;sat=100&amp;dpr=1 1x, https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?w=6000&amp;h=4000&amp;fit=crop&amp;sat=100&amp;dpr=2 2x, https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?w=6000&amp;h=4000&amp;fit=crop&amp;sat=100&amp;dpr=3 3x\\" alt=\\"Sapien pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas\\">"',
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
		'"<img src=\\"https://images.unsplash.com/photo-1587502537745-84b86da1204f?w=6550&amp;h=4367&amp;fit=crop&amp;sat=100\\" srcset=\\"https://images.unsplash.com/photo-1587502537745-84b86da1204f?w=6550&amp;h=4367&amp;fit=crop&amp;sat=100&amp;dpr=3 3x, https://images.unsplash.com/photo-1587502537745-84b86da1204f?w=6550&amp;h=4367&amp;fit=crop&amp;sat=100&amp;dpr=4 4x\\" alt=\\"Cras ornare arcu dui vivamus arcu felis bibendum ut tristique et egestas quis\\">"',
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
		'"<img src=\\"https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?w=6000&amp;h=4000&amp;fit=crop&amp;sat=100\\" srcset=\\"https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?h=4000&amp;fit=crop&amp;sat=100&amp;width=640 640w, https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?h=4000&amp;fit=crop&amp;sat=100&amp;width=828 828w, https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?h=4000&amp;fit=crop&amp;sat=100&amp;width=1200 1200w, https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?h=4000&amp;fit=crop&amp;sat=100&amp;width=2048 2048w, https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?h=4000&amp;fit=crop&amp;sat=100&amp;width=3840 3840w\\" alt=\\"Vitae turpis massa sed elementum tempus egestas\\">"',
	);
	expect(console.warn).toHaveBeenCalledOnce();
	// @ts-expect-error - actually, it's there :thinking:
	expect(vi.mocked(console.warn).calls[0]).toMatch(
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
		'"<div class=\\"wrapperComponent\\" src=\\"https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?w=2200&amp;h=1467&amp;fit=crop\\" alt=\\"A erat nam at lectus urna duis convallis\\" copyright=\\"Dolor magna eget est lorem ipsum dolor sit amet consectetur adipiscing elit pellentesque\\"></div>"',
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
		'"<div class=\\"wrapperComponent2\\" src=\\"https://images.unsplash.com/photo-1604537529428-15bcbeecfe4d?w=4240&amp;h=2832&amp;fit=crop\\" alt=\\"Semper auctor neque vitae tempus quam pellentesque nec nam\\" copyright=\\"Ut diam quam nulla porttitor massa\\"></div>"',
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
	// @ts-expect-error - actually, it's there :thinking:
	expect(vi.mocked(console.warn).calls[0]).toMatch(
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
		'"<img src=\\"https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=5616&amp;h=3744&amp;fit=crop\\" alt=\\"Hendrerit dolor magna eget est lorem ipsum dolor sit amet consectetur adipiscing\\">"',
	);
});
