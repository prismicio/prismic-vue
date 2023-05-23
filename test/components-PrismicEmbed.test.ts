import { expect, it, vi } from "vitest";

import * as mock from "@prismicio/mock";
import { EmbedField } from "@prismicio/client";
import { mount } from "@vue/test-utils";
import { markRaw } from "vue";

import { WrapperComponent } from "./__fixtures__/WrapperComponent";

import { PrismicEmbedImpl } from "../src/components";

it("renders embed field", () => {
	const wrapper = mount(PrismicEmbedImpl, {
		props: { field: mock.value.embed({ seed: 1 }) },
	});

	expect(wrapper.html()).toMatchInlineSnapshot(
		'"<div data-oembed=\\"https://www.youtube.com/embed/c-ATzcy6VkI\\" data-oembed-type=\\"video\\"><iframe width=\\"200\\" height=\\"113\\" src=\\"https://www.youtube.com/embed/c-ATzcy6VkI?feature=oembed\\" frameborder=\\"0\\" allow=\\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\\" allowfullscreen=\\"\\"></iframe></div>"',
	);
});

it("renders embed field with no HTML", () => {
	const wrapper = mount(PrismicEmbedImpl, {
		props: {
			field: {
				...mock.value.embed({ seed: 2 }),
				html: null,
			} as EmbedField,
		},
	});

	expect(wrapper.html()).toMatchInlineSnapshot(
		'"<div data-oembed=\\"https://www.youtube.com/watch?v=fiOwHYFkUz0\\" data-oembed-type=\\"video\\"></div>"',
	);
});

it("uses provided wrapper tag", () => {
	const wrapper = mount(PrismicEmbedImpl, {
		props: { field: mock.value.embed({ seed: 3 }), wrapper: "section" },
	});

	expect(wrapper.html()).toMatchInlineSnapshot(
		'"<section data-oembed=\\"https://www.youtube.com/watch?v=fiOwHYFkUz0\\" data-oembed-type=\\"video\\"><iframe width=\\"200\\" height=\\"113\\" src=\\"https://www.youtube.com/embed/iewZXv94XGY?feature=oembed\\" frameborder=\\"0\\" allow=\\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\\" allowfullscreen=\\"\\"></iframe></section>"',
	);
});

it("uses provided wrapper component", () => {
	const wrapper = mount(PrismicEmbedImpl, {
		props: {
			field: mock.value.embed({ seed: 4 }),
			wrapper: markRaw(WrapperComponent),
		},
	});

	expect(wrapper.html()).toMatchInlineSnapshot(
		'"<div class=\\"wrapperComponent\\" data-oembed=\\"https://www.youtube.com/watch?v=fiOwHYFkUz0\\" data-oembed-type=\\"video\\"><iframe width=\\"200\\" height=\\"113\\" src=\\"https://www.youtube.com/embed/iewZXv94XGY?feature=oembed\\" frameborder=\\"0\\" allow=\\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\\" allowfullscreen=\\"\\"></iframe></div>"',
	);
});

it("renders nothing when invalid", () => {
	vi.stubGlobal("console", { warn: vi.fn() });

	const wrapper = mount(PrismicEmbedImpl, {
		props: { field: null as unknown as EmbedField },
	});

	expect(wrapper.html()).toBe("");
	expect(console.warn).toHaveBeenCalledOnce();
	expect(vi.mocked(console.warn).mock.calls[0]).toMatch(
		/Invalid prop: type check failed for prop/i,
	);

	vi.resetAllMocks();
});

it("reacts to changes properly", async () => {
	const wrapper = mount(PrismicEmbedImpl, {
		props: { field: mock.value.embed({ seed: 5 }) },
	});

	const firstRender = wrapper.html();

	await wrapper.setProps({
		field: mock.value.embed({ seed: 1 }),
	});

	const secondRender = wrapper.html();

	expect(secondRender).not.toBe(firstRender);
	expect(secondRender).toMatchInlineSnapshot(
		'"<div data-oembed=\\"https://www.youtube.com/embed/c-ATzcy6VkI\\" data-oembed-type=\\"video\\"><iframe width=\\"200\\" height=\\"113\\" src=\\"https://www.youtube.com/embed/c-ATzcy6VkI?feature=oembed\\" frameborder=\\"0\\" allow=\\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\\" allowfullscreen=\\"\\"></iframe></div>"',
	);
});
