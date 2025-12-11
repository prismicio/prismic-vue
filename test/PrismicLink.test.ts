import { describe, expect, it, vi } from "vitest"

import { LinkType } from "@prismicio/client"
import { mount } from "@vue/test-utils"
import { markRaw } from "vue"

import {
	WrapperComponent,
	createWrapperComponent,
} from "./__fixtures__/WrapperComponent"
import router from "./__fixtures__/router"

import { PrismicLink } from "../src"

describe("renders a link field", () => {
	it("empty", (ctx) => {
		const wrapper = mount(PrismicLink, {
			props: {
				field: ctx.mock.value.link({ state: "empty", type: LinkType.Any }),
			},
			slots: { default: "foo" },
		})

		expect(wrapper.html()).toBe("<a>foo</a>")
	})

	it("link to web", (ctx) => {
		const wrapper = mount(PrismicLink, {
			props: {
				field: {
					...ctx.mock.value.link({
						type: LinkType.Web,
						withTargetBlank: false,
					}),
					url: "https://example.com",
				},
			},
			slots: { default: "foo" },
		})

		expect(wrapper.html()).toBe(
			'<a href="https://example.com" rel="noreferrer">foo</a>',
		)
	})

	it("link to web (blank target)", (ctx) => {
		const wrapper = mount(PrismicLink, {
			props: {
				field: {
					...ctx.mock.value.link({
						type: LinkType.Web,
						withTargetBlank: true,
					}),
					url: "https://example.com",
				},
			},
			slots: { default: "foo" },
		})

		expect(wrapper.html()).toBe(
			'<a href="https://example.com" target="_blank" rel="noreferrer">foo</a>',
		)
	})

	it("link to media", (ctx) => {
		const wrapper = mount(PrismicLink, {
			props: {
				field: {
					...ctx.mock.value.link({ type: LinkType.Media }),
					url: "https://example.com/image.png",
				},
			},
			slots: { default: "foo" },
		})

		expect(wrapper.html()).toBe(
			'<a href="https://example.com/image.png" rel="noreferrer">foo</a>',
		)
	})

	it("content relationship", (ctx) => {
		const wrapper = mount(PrismicLink, {
			props: {
				field: {
					...ctx.mock.value.link({ type: LinkType.Document }),
					url: "/bar",
				},
			},
			slots: { default: "foo" },
			global: {
				plugins: [router],
			},
		})

		expect(wrapper.html()).toBe('<a href="/bar" class="">foo</a>')
	})
})

describe("renders a document as link", () => {
	it("resolvable", (ctx) => {
		const wrapper = mount(PrismicLink, {
			props: {
				document: {
					...ctx.mock.value.document(),
					url: "/bar",
				},
			},
			slots: { default: "foo" },
			global: {
				plugins: [router],
			},
		})

		expect(wrapper.html()).toBe('<a href="/bar" class="">foo</a>')
	})

	it("non-resolvable", (ctx) => {
		const wrapper = mount(PrismicLink, {
			props: {
				document: {
					...ctx.mock.value.document(),
					url: null,
				},
			},
			slots: { default: "foo" },
		})

		expect(wrapper.html()).toBe("<a>foo</a>")
	})
})

describe("renders link content", () => {
	it("with link text", (ctx) => {
		const linkToWeb = mount(PrismicLink, {
			props: {
				field: {
					...ctx.mock.value.link({
						type: LinkType.Web,
						withTargetBlank: false,
						model: { type: "Link", config: { allowText: true } },
						withText: true,
					}),
					url: "https://example.com",
					text: "bar",
				},
			},
		})

		expect(linkToWeb.html()).toBe(
			'<a href="https://example.com" rel="noreferrer">bar</a>',
		)

		const linkToMedia = mount(PrismicLink, {
			props: {
				field: {
					...ctx.mock.value.link({ type: LinkType.Media }),
					url: "https://example.com/image.png",
					text: "bar",
				},
			},
		})

		expect(linkToMedia.html()).toBe(
			'<a href="https://example.com/image.png" rel="noreferrer">bar</a>',
		)

		const contentRelationship = mount(PrismicLink, {
			props: {
				field: {
					...ctx.mock.value.link({ type: LinkType.Document }),
					url: "/bar",
					text: "bar",
				},
			},
			global: {
				plugins: [router],
			},
		})

		expect(contentRelationship.html()).toBe('<a href="/bar" class="">bar</a>')
	})

	it("with slot (priority over link text)", (ctx) => {
		const linkToWeb = mount(PrismicLink, {
			props: {
				field: {
					...ctx.mock.value.link({
						type: LinkType.Web,
						withTargetBlank: false,
						model: { type: "Link", config: { allowText: true } },
						withText: true,
					}),
					url: "https://example.com",
					text: "bar",
				},
			},
			slots: { default: "foo" },
		})

		expect(linkToWeb.html()).toBe(
			'<a href="https://example.com" rel="noreferrer">foo</a>',
		)

		const linkToMedia = mount(PrismicLink, {
			props: {
				field: {
					...ctx.mock.value.link({ type: LinkType.Media }),
					url: "https://example.com/image.png",
					text: "bar",
				},
			},
			slots: { default: "foo" },
		})

		expect(linkToMedia.html()).toBe(
			'<a href="https://example.com/image.png" rel="noreferrer">foo</a>',
		)

		const contentRelationship = mount(PrismicLink, {
			props: {
				field: {
					...ctx.mock.value.link({ type: LinkType.Document }),
					url: "/bar",
					text: "bar",
				},
			},
			slots: { default: "foo" },
			global: {
				plugins: [router],
			},
		})

		expect(contentRelationship.html()).toBe('<a href="/bar" class="">foo</a>')
	})
})

describe("uses link resolver", () => {
	it("from props", (ctx) => {
		const spiedLinkResolver = vi.fn(() => "/bar")

		const wrapper = mount(PrismicLink, {
			props: {
				field: {
					...ctx.mock.value.link({ type: LinkType.Document }),
					url: undefined,
				},
				linkResolver: spiedLinkResolver,
			},
			slots: { default: "foo" },
			global: {
				plugins: [router],
			},
		})

		expect(spiedLinkResolver).toHaveBeenCalledOnce()
		expect(wrapper.html()).toBe('<a href="/bar" class="">foo</a>')
	})
})

describe("renders rel attribute", () => {
	it("omitted on internal links", (ctx) => {
		const wrapper = mount(PrismicLink, {
			props: {
				field: {
					...ctx.mock.value.link({ type: LinkType.Document }),
					url: "/bar",
				},
			},
			global: {
				plugins: [router],
			},
		})

		expect(wrapper.html()).not.toContain('rel="')
	})

	it("with default value on external links", (ctx) => {
		const wrapper = mount(PrismicLink, {
			props: {
				field: {
					...ctx.mock.value.link({
						type: LinkType.Web,
						withTargetBlank: false,
					}),
					url: "https://example.com",
				},
			},
		})

		expect(wrapper.html()).toContain('rel="noreferrer"')
	})

	it("with props function", (ctx) => {
		const wrapper = mount(PrismicLink, {
			props: {
				field: {
					...ctx.mock.value.link({
						type: LinkType.Web,
						withTargetBlank: false,
					}),
					url: "https://example.com",
				},
				rel: () => "props",
			},
			global: {
				plugins: [router],
			},
		})

		expect(wrapper.html()).toContain(`rel="props"`)
	})

	it("with props string value", (ctx) => {
		const wrapper = mount(PrismicLink, {
			props: {
				field: {
					...ctx.mock.value.link({
						type: LinkType.Web,
						withTargetBlank: false,
					}),
					url: "https://example.com",
				},
				rel: "props",
			},
			global: {
				plugins: [router],
			},
		})

		expect(wrapper.html()).toContain(`rel="props"`)
	})
})

describe("renders external links using component", () => {
	it("from props", (ctx) => {
		const wrapper = mount(PrismicLink, {
			props: {
				field: {
					...ctx.mock.value.link({
						type: LinkType.Web,
						withTargetBlank: false,
					}),
					url: "https://example.com",
				},
				externalComponent: markRaw(createWrapperComponent()),
			},
		})

		expect(wrapper.html()).toBe(
			'<div class="wrapperComponent" to="https://example.com" rel="noreferrer"></div>',
		)
	})

	it("forwards attributes", (ctx) => {
		const wrapper = mount(PrismicLink, {
			props: {
				field: {
					...ctx.mock.value.link({
						type: LinkType.Web,
						withTargetBlank: true,
					}),
					url: "https://example.com",
				},
				externalComponent: markRaw(WrapperComponent),
			},
			slots: { default: "foo" },
		})

		expect(wrapper.html()).toBe(
			'<div class="wrapperComponent" to="https://example.com" target="_blank" rel="noreferrer">foo</div>',
		)
	})
})

describe("renders internal links using component", () => {
	it("from props", (ctx) => {
		const wrapper = mount(PrismicLink, {
			props: {
				field: {
					...ctx.mock.value.link({ type: LinkType.Document }),
					url: "/bar",
				},
				internalComponent: markRaw(createWrapperComponent()),
			},
		})

		expect(wrapper.html()).toBe(
			'<div class="wrapperComponent" to="/bar"></div>',
		)
	})
})

it("reacts to changes properly", async (ctx) => {
	const wrapper = mount(PrismicLink, {
		props: {
			field: {
				...ctx.mock.value.link({ type: LinkType.Web }),
				url: "https://example.com",
			},
		},
		slots: { default: "foo" },
	})

	const firstRender = wrapper.html()

	await wrapper.setProps({
		field: {
			...ctx.mock.value.link({
				type: LinkType.Web,
				withTargetBlank: false,
			}),
			target: undefined,
			url: "https://prismic.io",
		},
	})

	const secondRender = wrapper.html()

	expect(secondRender).not.toBe(firstRender)
	expect(secondRender).toMatchInlineSnapshot(
		`"<a href="https://prismic.io" rel="noreferrer">foo</a>"`,
	)
})
