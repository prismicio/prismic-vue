import { describe, expect, it, vi } from "vitest"

import { LinkType } from "@prismicio/client"
import { mount } from "@vue/test-utils"
import { markRaw } from "vue"

import {
	WrapperComponent,
	createWrapperComponent,
} from "./__fixtures__/WrapperComponent"
import router from "./__fixtures__/router"

import { PrismicLink, createPrismic } from "../src"

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
		const wrapper = mount(PrismicLink, {
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

		expect(wrapper.html()).toBe(
			'<a href="https://example.com" rel="noreferrer">bar</a>',
		)
	})

	it("with slot (priority over link text)", (ctx) => {
		const wrapper = mount(PrismicLink, {
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

		expect(wrapper.html()).toBe(
			'<a href="https://example.com" rel="noreferrer">foo</a>',
		)
	})
})

describe("uses link resolver", () => {
	it("from plugin", (ctx) => {
		const spiedLinkResolver = vi.fn(() => "/bar")

		const prismic = createPrismic({
			endpoint: "test",
			linkResolver: spiedLinkResolver,
		})

		const wrapper = mount(PrismicLink, {
			props: {
				field: {
					...ctx.mock.value.link({ type: LinkType.Document }),
					url: undefined,
				},
			},
			slots: { default: "foo" },
			global: {
				plugins: [router, prismic],
			},
		})

		expect(spiedLinkResolver).toHaveBeenCalledOnce()
		expect(wrapper.html()).toBe('<a href="/bar" class="">foo</a>')
	})

	it("from props (priority over plugin)", (ctx) => {
		const spiedLinkResolver1 = vi.fn(() => "/bar")
		const spiedLinkResolver2 = vi.fn(() => "/baz")

		const prismic = createPrismic({
			endpoint: "test",
			linkResolver: spiedLinkResolver1,
		})

		const wrapper = mount(PrismicLink, {
			props: {
				field: {
					...ctx.mock.value.link({ type: LinkType.Document }),
					url: undefined,
				},
				linkResolver: spiedLinkResolver2,
			},
			slots: { default: "foo" },
			global: {
				plugins: [router, prismic],
			},
		})

		expect(spiedLinkResolver1).not.toHaveBeenCalled()
		expect(spiedLinkResolver2).toHaveBeenCalledOnce()
		expect(wrapper.html()).toBe('<a href="/baz" class="">foo</a>')
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

	it("with plugin options", (ctx) => {
		const prismic = createPrismic({
			endpoint: "test",
			components: {
				linkRel: () => "plugin",
			},
		})

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
			global: {
				plugins: [router, prismic],
			},
		})

		expect(wrapper.html()).toContain(`rel="plugin"`)
	})

	it("with props function (priority over plugin)", (ctx) => {
		const prismic = createPrismic({
			endpoint: "test",
			components: {
				linkRel: () => "plugin",
			},
		})

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
				plugins: [router, prismic],
			},
		})

		expect(wrapper.html()).toContain(`rel="props"`)
	})

	it("with props string value (priority over plugin)", (ctx) => {
		const prismic = createPrismic({
			endpoint: "test",
			components: {
				linkRel: () => "plugin",
			},
		})

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
				plugins: [router, prismic],
			},
		})

		expect(wrapper.html()).toContain(`rel="props"`)
	})
})

describe("renders external links using component", () => {
	it("from plugin", (ctx) => {
		const prismic = createPrismic({
			endpoint: "test",
			components: {
				linkExternalComponent: WrapperComponent,
			},
		})

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
			global: { plugins: [prismic] },
		})

		expect(wrapper.html()).toBe(
			'<div class="wrapperComponent" to="https://example.com" rel="noreferrer">Cursus sit</div>',
		)
	})

	it("from props (priority over plugin)", (ctx) => {
		const prismic = createPrismic({
			endpoint: "test",
			components: {
				linkExternalComponent: createWrapperComponent(1),
			},
		})

		const wrapper = mount(PrismicLink, {
			props: {
				field: {
					...ctx.mock.value.link({
						type: LinkType.Web,
						withTargetBlank: false,
					}),
					url: "https://example.com",
				},
				externalComponent: markRaw(createWrapperComponent(2)),
			},
			global: { plugins: [prismic] },
		})

		expect(wrapper.html()).toBe(
			'<div class="wrapperComponent2" to="https://example.com" rel="noreferrer"></div>',
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
	it("from plugin", (ctx) => {
		const prismic = createPrismic({
			endpoint: "test",
			components: {
				linkInternalComponent: WrapperComponent,
			},
		})

		const wrapper = mount(PrismicLink, {
			props: {
				field: {
					...ctx.mock.value.link({ type: LinkType.Document }),
					url: "/bar",
				},
			},
			global: { plugins: [prismic] },
		})

		expect(wrapper.html()).toBe(
			'<div class="wrapperComponent" to="/bar"></div>',
		)
	})

	it("from props (priority over plugin)", (ctx) => {
		const prismic = createPrismic({
			endpoint: "test",
			components: {
				linkInternalComponent: createWrapperComponent(1),
			},
		})

		const wrapper = mount(PrismicLink, {
			props: {
				field: {
					...ctx.mock.value.link({ type: LinkType.Document }),
					url: "/bar",
				},
				internalComponent: markRaw(createWrapperComponent(2)),
			},
			global: { plugins: [prismic] },
		})

		expect(wrapper.html()).toBe(
			'<div class="wrapperComponent2" to="/bar"></div>',
		)
	})
})

it("throws when trying to render a non-link field", () => {
	// The warning only logs in "development".
	const originalNodeEnv = process.env.NODE_ENV
	process.env.NODE_ENV = "development"
	const consoleErrorSpy = vi
		.spyOn(console, "error")
		.mockImplementation(() => void 0)

	expect(() =>
		mount(PrismicLink, {
			props: {
				// @ts-expect-error - Purposely giving incompatible props.
				field: {},
			},
		}),
	).toThrowError(/missing-link-properties/i)

	consoleErrorSpy.mockRestore()
	process.env.NODE_ENV = originalNodeEnv
})

it("warns when trying to render an invalid link field", () => {
	// The warning only logs in "development".
	const originalNodeEnv = process.env.NODE_ENV
	process.env.NODE_ENV = "development"
	const consoleWarnSpy = vi
		.spyOn(console, "warn")
		.mockImplementation(() => void 0)

	mount(PrismicLink, {
		props: {
			field: { link_type: "Any", foo: "bar" },
		},
	})

	expect(consoleWarnSpy).toHaveBeenCalledWith(
		expect.stringMatching(/The provided field is missing required properties/i),
		expect.anything(),
	)
	expect(consoleWarnSpy).toHaveBeenCalledWith(
		expect.stringMatching(/missing-link-properties/i),
		expect.anything(),
	)

	consoleWarnSpy.mockClear()

	mount(PrismicLink, {
		props: {
			field: { link_type: "Any", text: "foo", foo: "bar" },
		},
	})

	expect(consoleWarnSpy).toHaveBeenCalledWith(
		expect.stringMatching(/The provided field is missing required properties/i),
		expect.anything(),
	)
	expect(consoleWarnSpy).toHaveBeenCalledWith(
		expect.stringMatching(/missing-link-properties/i),
		expect.anything(),
	)

	consoleWarnSpy.mockRestore()
	process.env.NODE_ENV = originalNodeEnv
})

it("warns when trying to render an invalid document", () => {
	// The warning only logs in "development".
	const originalNodeEnv = process.env.NODE_ENV
	process.env.NODE_ENV = "development"
	const consoleWarnSpy = vi
		.spyOn(console, "warn")
		.mockImplementation(() => void 0)

	mount(PrismicLink, {
		props: {
			// @ts-expect-error - Purposely giving incompatible props.
			document: {},
		},
	})

	expect(consoleWarnSpy).toHaveBeenCalledWith(
		expect.stringMatching(
			/The provided document is missing required properties/i,
		),
		expect.anything(),
	)
	expect(consoleWarnSpy).toHaveBeenCalledWith(
		expect.stringMatching(/missing-link-properties/i),
		expect.anything(),
	)

	consoleWarnSpy.mockRestore()
	process.env.NODE_ENV = originalNodeEnv
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
