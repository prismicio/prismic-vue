import test from "ava";
import { mount } from "@vue/test-utils";
import * as mock from "@prismicio/mock";

import { markRaw } from "vue";
import { EmbedField } from "@prismicio/types";

import { WrapperComponent } from "./__fixtures__/WrapperComponent";

import { PrismicEmbedImpl } from "../src/components";

test("renders embed field", (t) => {
	const wrapper = mount(PrismicEmbedImpl, {
		props: { field: mock.value.embed({ seed: 1 }) },
	});

	t.snapshot(wrapper.html());
});

test("renders embed field with no HTML", (t) => {
	const wrapper = mount(PrismicEmbedImpl, {
		props: {
			field: {
				...mock.value.embed({ seed: 2 }),
				html: null,
			} as EmbedField,
		},
	});

	t.snapshot(wrapper.html());
});

test("uses provided wrapper tag", (t) => {
	const wrapper = mount(PrismicEmbedImpl, {
		props: { field: mock.value.embed({ seed: 3 }), wrapper: "section" },
	});

	t.snapshot(wrapper.html());
});

test("uses provided wrapper component", (t) => {
	const wrapper = mount(PrismicEmbedImpl, {
		props: {
			field: mock.value.embed({ seed: 4 }),
			wrapper: markRaw(WrapperComponent),
		},
	});

	t.snapshot(wrapper.html());
});

test("renders nothing when invalid", (t) => {
	const wrapper = mount(PrismicEmbedImpl, {
		props: { field: null as unknown as EmbedField },
	});

	t.is(wrapper.html(), "<!---->");
});

test("reacts to changes properly", async (t) => {
	const wrapper = mount(PrismicEmbedImpl, {
		props: { field: mock.value.embed({ seed: 5 }) },
	});

	const firstRender = wrapper.html();

	await wrapper.setProps({
		field: mock.value.embed({ seed: 6 }),
	});

	const secondRender = wrapper.html();

	t.not(secondRender, firstRender);
	t.snapshot(secondRender);
});
