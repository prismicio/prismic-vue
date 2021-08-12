import test from "ava";
import * as sinon from "sinon";
import { mount } from "@vue/test-utils";
import * as mock from "@prismicio/mock";

import { markRaw } from "vue";
import { LinkField, LinkType } from "@prismicio/types";

import { WrapperComponent } from "./__fixtures__/WrapperComponent";
import router from "./__fixtures__/router";

import { PrismicLinkImpl } from "../src/components";
import { createPrismic } from "../src";

test("renders empty link field", (t) => {
	const wrapper = mount(PrismicLinkImpl, {
		props: {
			field: mock.value.link({ seed: 1, isFilled: false, type: LinkType.Any }),
		},
		slots: { default: "foo" },
	});

	t.is(wrapper.html(), '<a href="">foo</a>');
});

test("renders link to web field", (t) => {
	const wrapper = mount(PrismicLinkImpl, {
		props: {
			field: {
				...mock.value.link({ seed: 1, type: LinkType.Web }),
				url: "https://example.com",
			},
		},
		slots: { default: "foo" },
	});

	t.is(wrapper.html(), '<a href="https://example.com">foo</a>');
});

test("renders link to media field", (t) => {
	const wrapper = mount(PrismicLinkImpl, {
		props: {
			field: {
				...mock.value.link({ seed: 1, type: LinkType.Media }),
				url: "https://example.com/image.png",
			},
		},
		slots: { default: "foo" },
	});

	t.is(wrapper.html(), '<a href="https://example.com/image.png">foo</a>');
});

test("renders link to document field", (t) => {
	const wrapper = mount(PrismicLinkImpl, {
		props: {
			field: {
				...mock.value.link({ seed: 1, type: LinkType.Document }),
				url: "/bar",
			},
		},
		slots: { default: "foo" },
		global: {
			plugins: [router],
		},
	});

	t.is(wrapper.html(), '<a href="/bar" class="">foo</a>');
});

test("uses plugin provided link resolver", (t) => {
	const spiedLinkResolver = sinon.spy(() => "/bar");

	const prismic = createPrismic({
		endpoint: "test",
		linkResolver: spiedLinkResolver,
	});

	const wrapper = mount(PrismicLinkImpl, {
		props: {
			field: {
				...mock.value.link({ seed: 1, type: LinkType.Document }),
				url: undefined,
			},
		},
		slots: { default: "foo" },
		global: {
			plugins: [router, prismic],
		},
	});

	t.is(spiedLinkResolver.callCount, 1);
	t.is(wrapper.html(), '<a href="/bar" class="">foo</a>');
});

test("uses provided link resolver over plugin provided", (t) => {
	const spiedLinkResolver1 = sinon.spy(() => "/bar");
	const spiedLinkResolver2 = sinon.spy(() => "/baz");

	const prismic = createPrismic({
		endpoint: "test",
		linkResolver: spiedLinkResolver1,
	});

	const wrapper = mount(PrismicLinkImpl, {
		props: {
			field: {
				...mock.value.link({ seed: 1, type: LinkType.Document }),
				url: undefined,
			},
			linkResolver: spiedLinkResolver2,
		},
		slots: { default: "foo" },
		global: {
			plugins: [router, prismic],
		},
	});

	t.false(spiedLinkResolver1.called);
	t.is(spiedLinkResolver2.callCount, 1);
	t.is(wrapper.html(), '<a href="/baz" class="">foo</a>');
});

test("renders link with blank target", (t) => {
	const wrapper = mount(PrismicLinkImpl, {
		props: {
			field: {
				...mock.value.link({ seed: 2, type: LinkType.Web }),
				url: "https://example.com",
				target: "_blank",
			},
		},
		slots: { default: "foo" },
	});

	t.is(
		wrapper.html(),
		'<a href="https://example.com" target="_blank" rel="noopener noreferrer">foo</a>',
	);
});

test("renders link with blank target using provided default rel attribute", (t) => {
	const wrapper = mount(PrismicLinkImpl, {
		props: {
			field: {
				...mock.value.link({ seed: 3, type: LinkType.Web }),
				url: "https://example.com",
				target: "_blank",
			},
			linkBlankTargetRelAttribute: "noopener",
		},
		slots: { default: "foo" },
	});

	t.is(
		wrapper.html(),
		'<a href="https://example.com" target="_blank" rel="noopener">foo</a>',
	);
});

test("renders link with provided blank and rel attribute", (t) => {
	const wrapper = mount(PrismicLinkImpl, {
		props: {
			field: {
				...mock.value.link({ seed: 4, type: LinkType.Web }),
				url: "https://example.com",
			},
			target: "bar",
			rel: "baz",
		},
		slots: { default: "foo" },
	});

	t.is(
		wrapper.html(),
		'<a href="https://example.com" target="bar" rel="baz">foo</a>',
	);
});

test("uses provided external link component on external link", (t) => {
	const wrapper = mount(PrismicLinkImpl, {
		props: {
			field: {
				...mock.value.link({ seed: 5, type: LinkType.Web }),
				url: "https://example.com",
			},
			externalComponent: markRaw(WrapperComponent),
		},
	});

	t.is(
		wrapper.html(),
		'<div class="wrapperComponent" to="https://example.com"></div>',
	);
});

test("uses provided internal link component on internal link", (t) => {
	const wrapper = mount(PrismicLinkImpl, {
		props: {
			field: {
				...mock.value.link({ seed: 6, type: LinkType.Document }),
				url: "/bar",
			},
			internalComponent: markRaw(WrapperComponent),
		},
	});

	t.is(wrapper.html(), '<div class="wrapperComponent" to="/bar"></div>');
});

test("renders nothing when invalid", (t) => {
	const wrapper = mount(PrismicLinkImpl, {
		props: { field: null as unknown as LinkField },
		slots: { default: "foo" },
	});

	t.is(wrapper.html(), "<!---->");
});

test("reacts to changes properly", async (t) => {
	const wrapper = mount(PrismicLinkImpl, {
		props: {
			field: {
				...mock.value.link({ seed: 7, type: LinkType.Web }),
				url: "https://example.com",
			},
		},
		slots: { default: "foo" },
	});

	const firstRender = wrapper.html();

	await wrapper.setProps({
		field: {
			...mock.value.link({ seed: 8, type: LinkType.Web }),
			target: null,
			url: "https://prismic.io",
		},
	});

	const secondRender = wrapper.html();

	t.not(secondRender, firstRender);
	t.is(secondRender, '<a href="https://prismic.io">foo</a>');
});
