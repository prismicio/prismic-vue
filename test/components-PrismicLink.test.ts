import { expect, it, vi } from "vitest";

import * as mock from "@prismicio/mock";
import { LinkField, LinkType } from "@prismicio/client";
import { mount } from "@vue/test-utils";
import { markRaw } from "vue";

import {
	WrapperComponent,
	createWrapperComponent,
} from "./__fixtures__/WrapperComponent";
import router from "./__fixtures__/router";

import { createPrismic } from "../src";
import { PrismicLinkImpl } from "../src/components";

it("renders empty link field", () => {
	const wrapper = mount(PrismicLinkImpl, {
		props: {
			field: mock.value.link({ seed: 1, state: "empty", type: LinkType.Any }),
		},
		slots: { default: "foo" },
	});

	expect(wrapper.html()).toBe('<a href="">foo</a>');
});

it("renders link to web field", () => {
	const wrapper = mount(PrismicLinkImpl, {
		props: {
			field: {
				...mock.value.link({
					seed: 2,
					type: LinkType.Web,
					withTargetBlank: false,
				}),
				url: "https://example.com",
			},
		},
		slots: { default: "foo" },
	});

	expect(wrapper.html()).toBe('<a href="https://example.com">foo</a>');
});

it("renders link to media field", () => {
	const wrapper = mount(PrismicLinkImpl, {
		props: {
			field: {
				...mock.value.link({ seed: 3, type: LinkType.Media }),
				url: "https://example.com/image.png",
			},
		},
		slots: { default: "foo" },
	});

	expect(wrapper.html()).toBe(
		'<a href="https://example.com/image.png">foo</a>',
	);
});

it("renders link to document field", () => {
	const wrapper = mount(PrismicLinkImpl, {
		props: {
			field: {
				...mock.value.link({ seed: 4, type: LinkType.Document }),
				url: "/bar",
			},
		},
		slots: { default: "foo" },
		global: {
			plugins: [router],
		},
	});

	expect(wrapper.html()).toBe('<a href="/bar" class="">foo</a>');
});

it("renders document as link", (ctx) => {
	const wrapper = mount(PrismicLinkImpl, {
		props: {
			field: {
				...mock.value.document({ seed: ctx.meta.name }),
				url: "/bar",
			},
		},
		slots: { default: "foo" },
		global: {
			plugins: [router],
		},
	});

	expect(wrapper.html()).toBe('<a href="/bar" class="">foo</a>');
});

it("renders link text when slot is not provided", () => {
	const wrapper = mount(PrismicLinkImpl, {
		props: {
			field: {
				...mock.value.link({
					seed: 2,
					type: LinkType.Web,
					withTargetBlank: false,
				}),
				url: "https://example.com",
				text: "bar",
			},
		},
	});

	expect(wrapper.html()).toBe('<a href="https://example.com">bar</a>');
});

it("renders slot over link text when slot is provided", () => {
	const wrapper = mount(PrismicLinkImpl, {
		props: {
			field: {
				...mock.value.link({
					seed: 2,
					type: LinkType.Web,
					withTargetBlank: false,
				}),
				url: "https://example.com",
				text: "bar",
			},
		},
		slots: { default: "foo" },
	});

	expect(wrapper.html()).toBe('<a href="https://example.com">foo</a>');
});

it("renders non-resolvable document as link", (ctx) => {
	const wrapper = mount(PrismicLinkImpl, {
		props: {
			field: {
				...mock.value.document({ seed: ctx.meta.name }),
				url: null,
			},
		},
		slots: { default: "foo" },
		global: {
			plugins: [router],
		},
	});

	expect(wrapper.html()).toBe('<a href="">foo</a>');
});

it("uses plugin provided link resolver", () => {
	const spiedLinkResolver = vi.fn(() => "/bar");

	const prismic = createPrismic({
		endpoint: "test",
		linkResolver: spiedLinkResolver,
	});

	const wrapper = mount(PrismicLinkImpl, {
		props: {
			field: {
				...mock.value.link({ seed: 5, type: LinkType.Document }),
				url: undefined,
			},
		},
		slots: { default: "foo" },
		global: {
			plugins: [router, prismic],
		},
	});

	expect(spiedLinkResolver).toHaveBeenCalledOnce();
	expect(wrapper.html()).toBe('<a href="/bar" class="">foo</a>');
});

it("uses provided link resolver over plugin provided", () => {
	const spiedLinkResolver1 = vi.fn(() => "/bar");
	const spiedLinkResolver2 = vi.fn(() => "/baz");

	const prismic = createPrismic({
		endpoint: "test",
		linkResolver: spiedLinkResolver1,
	});

	const wrapper = mount(PrismicLinkImpl, {
		props: {
			field: {
				...mock.value.link({ seed: 6, type: LinkType.Document }),
				url: undefined,
			},
			linkResolver: spiedLinkResolver2,
		},
		slots: { default: "foo" },
		global: {
			plugins: [router, prismic],
		},
	});

	expect(spiedLinkResolver1).not.toHaveBeenCalled();
	expect(spiedLinkResolver2).toHaveBeenCalledOnce();
	expect(wrapper.html()).toBe('<a href="/baz" class="">foo</a>');
});

it("renders link with blank target", () => {
	const wrapper = mount(PrismicLinkImpl, {
		props: {
			field: {
				...mock.value.link({
					seed: 7,
					type: LinkType.Web,
					withTargetBlank: true,
				}),
				url: "https://example.com",
			},
		},
		slots: { default: "foo" },
	});

	expect(wrapper.html()).toBe(
		'<a href="https://example.com" target="_blank" rel="noopener noreferrer">foo</a>',
	);
});

it("renders link with blank target using plugin provided default rel attribute", () => {
	const prismic = createPrismic({
		endpoint: "test",
		components: {
			linkBlankTargetRelAttribute: "bar",
		},
	});

	const wrapper = mount(PrismicLinkImpl, {
		props: {
			field: {
				...mock.value.link({
					seed: 8,
					type: LinkType.Web,
					withTargetBlank: true,
				}),
				url: "https://example.com",
			},
		},
		slots: { default: "foo" },
		global: {
			plugins: [router, prismic],
		},
	});

	expect(wrapper.html()).toBe(
		'<a href="https://example.com" target="_blank" rel="bar">foo</a>',
	);
});

it("renders link with blank target using provided default rel attribute over plugin provided", () => {
	const prismic = createPrismic({
		endpoint: "test",
		components: {
			linkBlankTargetRelAttribute: "bar",
		},
	});

	const wrapper = mount(PrismicLinkImpl, {
		props: {
			field: {
				...mock.value.link({
					seed: 9,
					type: LinkType.Web,
					withTargetBlank: true,
				}),
				url: "https://example.com",
			},
			blankTargetRelAttribute: "baz",
		},
		slots: { default: "foo" },
		global: {
			plugins: [router, prismic],
		},
	});

	expect(wrapper.html()).toBe(
		'<a href="https://example.com" target="_blank" rel="baz">foo</a>',
	);
});

it("uses provided blank and rel attribute", () => {
	const wrapper = mount(PrismicLinkImpl, {
		props: {
			field: {
				...mock.value.link({ seed: 10, type: LinkType.Web }),
				url: "https://example.com",
			},
			target: "bar",
			rel: "baz",
		},
		slots: { default: "foo" },
	});

	expect(wrapper.html()).toBe(
		'<a href="https://example.com" target="bar" rel="baz">foo</a>',
	);
});

it("forwards blank and rel attribute to component links", () => {
	const wrapper = mount(PrismicLinkImpl, {
		props: {
			field: {
				...mock.value.link({
					seed: 10,
					type: LinkType.Web,
					withTargetBlank: true,
				}),
				url: "https://example.com",
			},
			externalComponent: markRaw(WrapperComponent),
		},
		slots: { default: "foo" },
	});

	expect(wrapper.html()).toBe(
		'<div class="wrapperComponent" to="https://example.com" target="_blank" rel="noopener noreferrer">foo</div>',
	);
});

it("uses plugin provided external link component on external link", () => {
	const prismic = createPrismic({
		endpoint: "test",
		components: {
			linkExternalComponent: WrapperComponent,
		},
	});

	const wrapper = mount(PrismicLinkImpl, {
		props: {
			field: {
				...mock.value.link({
					seed: 11,
					type: LinkType.Web,
					withTargetBlank: false,
				}),
				url: "https://example.com",
			},
		},
		global: { plugins: [prismic] },
	});

	expect(wrapper.html()).toBe(
		'<div class="wrapperComponent" to="https://example.com"></div>',
	);
});

it("uses provided external link component over plugin provided on external link", () => {
	const prismic = createPrismic({
		endpoint: "test",
		components: {
			linkExternalComponent: createWrapperComponent(1),
		},
	});

	const wrapper = mount(PrismicLinkImpl, {
		props: {
			field: {
				...mock.value.link({
					seed: 12,
					type: LinkType.Web,
					withTargetBlank: false,
				}),
				url: "https://example.com",
			},
			externalComponent: markRaw(createWrapperComponent(2)),
		},
		global: { plugins: [prismic] },
	});

	expect(wrapper.html()).toBe(
		'<div class="wrapperComponent2" to="https://example.com"></div>',
	);
});

it("uses plugin provided internal link component on internal link", () => {
	const prismic = createPrismic({
		endpoint: "test",
		components: {
			linkInternalComponent: WrapperComponent,
		},
	});

	const wrapper = mount(PrismicLinkImpl, {
		props: {
			field: {
				...mock.value.link({ seed: 13, type: LinkType.Document }),
				url: "/bar",
			},
		},
		global: { plugins: [prismic] },
	});

	expect(wrapper.html()).toBe('<div class="wrapperComponent" to="/bar"></div>');
});

it("uses provided internal link component over plugin provided on internal link", () => {
	const prismic = createPrismic({
		endpoint: "test",
		components: {
			linkInternalComponent: createWrapperComponent(1),
		},
	});

	const wrapper = mount(PrismicLinkImpl, {
		props: {
			field: {
				...mock.value.link({ seed: 14, type: LinkType.Document }),
				url: "/bar",
			},
			internalComponent: markRaw(createWrapperComponent(2)),
		},
		global: { plugins: [prismic] },
	});

	expect(wrapper.html()).toBe(
		'<div class="wrapperComponent2" to="/bar"></div>',
	);
});

it("renders nothing when invalid", () => {
	vi.stubGlobal("console", { warn: vi.fn() });

	const wrapper = mount(PrismicLinkImpl, {
		props: { field: null as unknown as LinkField },
		slots: { default: "foo" },
	});

	expect(wrapper.html()).toBe("");
	expect(console.warn).toHaveBeenCalledOnce();
	expect(vi.mocked(console.warn).mock.calls[0]).toMatch(
		/Invalid prop: type check failed for prop/i,
	);

	vi.resetAllMocks();
});

it("reacts to changes properly", async () => {
	const wrapper = mount(PrismicLinkImpl, {
		props: {
			field: {
				...mock.value.link({ seed: 15, type: LinkType.Web }),
				url: "https://example.com",
			},
		},
		slots: { default: "foo" },
	});

	const firstRender = wrapper.html();

	await wrapper.setProps({
		field: {
			...mock.value.link({
				seed: 16,
				type: LinkType.Web,
				withTargetBlank: false,
			}),
			target: undefined,
			url: "https://prismic.io",
		},
	});

	const secondRender = wrapper.html();

	expect(secondRender).not.toBe(firstRender);
	expect(secondRender).toMatchInlineSnapshot(
		'"<a href=\\"https://prismic.io\\">foo</a>"',
	);
});
