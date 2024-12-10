import { describe, expect, it, vi } from "vitest"

import type { RichTextField, RichTextNodeTypes } from "@prismicio/client"
import { RichTextNodeType } from "@prismicio/client"
import { flushPromises, mount } from "@vue/test-utils"
import { markRaw } from "vue"
import { routerKey } from "vue-router"

import { WrapperComponent } from "./__fixtures__/WrapperComponent"
import { richTextFixture } from "./__fixtures__/richText"

import { PrismicRichText, createPrismic } from "../src"

describe("renders a rich text field", () => {
	it("as HTML", () => {
		const wrapper = mount(PrismicRichText, {
			props: {
				field: [
					{
						type: RichTextNodeType.heading1,
						text: "Heading 1",
						spans: [],
					},
				],
			},
		})

		expect(wrapper.html()).toBe(`<div>
  <h1>Heading 1</h1>
</div>`)
	})

	it("as nothing when passed an empty field", () => {
		const wrapper = mount(PrismicRichText, {
			props: { field: [] },
		})

		expect(wrapper.html()).toBe("<!--v-if-->")
	})
})

describe("renders fallback value", () => {
	it.skip("when passed an empty field", () => {
		const nullField = mount(PrismicRichText, {
			props: { field: null, fallback: "fallback" },
		})

		const undefinedField = mount(PrismicRichText, {
			props: { field: undefined, fallback: "fallback" },
		})

		const emptyField = mount(PrismicRichText, {
			props: { field: [], fallback: "fallback" },
		})

		expect(nullField.html()).toBe("fallback")
		expect(undefinedField.html()).toBe("fallback")
		expect(emptyField.html()).toBe("fallback")
	})

	it("when passed an empty field with wrapper", () => {
		const nullField = mount(PrismicRichText, {
			props: { field: null, fallback: "fallback", wrapper: "p" },
		})

		const undefinedField = mount(PrismicRichText, {
			props: { field: undefined, fallback: "fallback", wrapper: "p" },
		})

		const emptyField = mount(PrismicRichText, {
			props: { field: [], fallback: "fallback", wrapper: "p" },
		})

		expect(nullField.html()).toBe("<p>fallback</p>")
		expect(undefinedField.html()).toBe("<p>fallback</p>")
		expect(emptyField.html()).toBe("<p>fallback</p>")
	})
})

describe("renders with wrapper", () => {
	it("tag", () => {
		const wrapper = mount(PrismicRichText, {
			props: {
				field: [
					{
						type: RichTextNodeType.heading1,
						text: "Heading 1",
						spans: [],
					},
				],
				wrapper: "section",
			},
		})

		expect(wrapper.html()).toBe(`<section>
  <h1>Heading 1</h1>
</section>`)
	})

	it("component", () => {
		const wrapper = mount(PrismicRichText, {
			props: {
				field: [
					{
						type: RichTextNodeType.heading1,
						text: "Heading 1",
						spans: [],
					},
				],
				wrapper: markRaw(WrapperComponent),
			},
		})

		expect(wrapper.html()).toBe(
			`<div class="wrapperComponent">
  <h1>Heading 1</h1>
</div>`,
		)
	})

	it("forwards attributes to wrapper", () => {
		const wrapper = mount(PrismicRichText, {
			props: {
				field: [
					{
						type: RichTextNodeType.heading1,
						text: "Heading 1",
						spans: [],
					},
				],
				wrapper: "section",
			},
			attrs: {
				class: "foo",
			},
		})

		expect(wrapper.html()).toBe(
			`<section class="foo">
  <h1>Heading 1</h1>
</section>`,
		)
	})
})

describe("uses link resolver", () => {
	it("from plugin", (ctx) => {
		const spiedLinkResolver = vi.fn(() => ctx.task.name)

		const prismic = createPrismic({
			endpoint: "test",
			linkResolver: spiedLinkResolver,
		})

		const wrapper = mount(PrismicRichText, {
			props: { field: richTextFixture.en },
			global: { plugins: [prismic] },
		})

		expect(spiedLinkResolver).toHaveBeenCalled()
		expect(wrapper.html()).toMatch(`href="${ctx.task.name}"`)
	})

	it("from props (priority over plugin)", (ctx) => {
		const spiedLinkResolver1 = vi.fn(() => `${ctx.task.name}1`)
		const spiedLinkResolver2 = vi.fn(() => `${ctx.task.name}2`)

		const prismic = createPrismic({
			endpoint: "test",
			linkResolver: spiedLinkResolver1,
		})

		const wrapper = mount(PrismicRichText, {
			props: { field: richTextFixture.en, linkResolver: spiedLinkResolver2 },
			global: { plugins: [prismic] },
		})

		expect(spiedLinkResolver1).not.toHaveBeenCalled()
		expect(spiedLinkResolver2).toHaveBeenCalled()
		expect(wrapper.html()).toMatch(`href="${ctx.task.name}2"`)
	})
})

// TODO: Remove in v6
describe("uses HTML serializer", () => {
	it("function from plugin", (ctx) => {
		const spiedSerializer = vi.fn((type: RichTextNodeTypes) =>
			type === RichTextNodeType.paragraph ? `<p>${ctx.task.name}</p>` : null,
		)

		const prismic = createPrismic({
			endpoint: "test",
			richTextSerializer: spiedSerializer,
		})

		const wrapper = mount(PrismicRichText, {
			props: {
				field: richTextFixture.en,
			},
			global: { plugins: [prismic] },
		})

		expect(spiedSerializer).toHaveBeenCalled()
		expect(wrapper.html()).toMatch(`<p>${ctx.task.name}</p>`)
	})

	it("map from plugin", (ctx) => {
		const spiedSerializer = {
			paragraph: vi.fn(() => `<p>${ctx.task.name}</p>`),
		}

		const prismic = createPrismic({
			endpoint: "test",
			richTextSerializer: spiedSerializer,
		})

		const wrapper = mount(PrismicRichText, {
			props: {
				field: richTextFixture.en,
			},
			global: { plugins: [prismic] },
		})

		expect(spiedSerializer.paragraph).toHaveBeenCalled()
		expect(wrapper.html()).toMatch(`<p>${ctx.task.name}</p>`)
	})

	it("function from props (priority over plugin)", (ctx) => {
		const spiedSerializer1 = vi.fn((type: RichTextNodeTypes) =>
			type === RichTextNodeType.paragraph ? `<p>${ctx.task.name}1</p>` : null,
		)
		const spiedSerializer2 = vi.fn((type: RichTextNodeTypes) =>
			type === RichTextNodeType.paragraph ? `<p>${ctx.task.name}2</p>` : null,
		)

		const prismic = createPrismic({
			endpoint: "test",
			richTextSerializer: spiedSerializer1,
		})

		const wrapper = mount(PrismicRichText, {
			props: {
				field: richTextFixture.en,
				serializer: spiedSerializer2,
			},
			global: { plugins: [prismic] },
		})

		expect(spiedSerializer1).not.toHaveBeenCalled()
		expect(spiedSerializer2).toHaveBeenCalled()
		expect(wrapper.html()).toMatch(`<p>${ctx.task.name}2</p>`)
	})

	it("map from props (priority over plugin)", (ctx) => {
		const spiedSerializer1 = {
			paragraph: vi.fn(() => `<p>${ctx.task.name}1</p>`),
		}
		const spiedSerializer2 = {
			paragraph: vi.fn(() => `<p>${ctx.task.name}2</p>`),
		}

		const prismic = createPrismic({
			endpoint: "test",
			richTextSerializer: spiedSerializer1,
		})

		const wrapper = mount(PrismicRichText, {
			props: {
				field: richTextFixture.en,
				serializer: spiedSerializer2,
			},
			global: { plugins: [prismic] },
		})

		expect(spiedSerializer1.paragraph).not.toHaveBeenCalled()
		expect(spiedSerializer2.paragraph).toHaveBeenCalled()
		expect(wrapper.html()).toMatch(`<p>${ctx.task.name}2</p>`)
	})
})

// TODO: Remove in v6
describe("navigates internal links using Vue Router if available", () => {
	it("on click", async () => {
		const spiedPush = vi.fn()

		const wrapper = mount(PrismicRichText, {
			props: {
				field: richTextFixture.link,
				serializer: {
					hyperlink: () => `<a href="/foo">link</a>`,
				},
			},
			global: {
				provide: {
					[routerKey as unknown as string]: {
						push: spiedPush,
					},
				},
			},
		})

		// Click doesn't propagate if we don't wait here
		await flushPromises()

		await wrapper.get("a").trigger("click")

		expect(spiedPush).toHaveBeenCalledOnce()
		expect(spiedPush).toHaveBeenCalledWith(`/foo`)

		// This is used to make sure `removeListeners()` is called upon unmount
		wrapper.unmount()
	})

	it("on click when using custom wrapper", async () => {
		const spiedPush = vi.fn()

		const wrapper = mount(PrismicRichText, {
			props: {
				field: richTextFixture.link,
				wrapper: markRaw(WrapperComponent),
				serializer: {
					hyperlink: () => `<a href="/foo">link</a>`,
				},
			},
			global: {
				provide: {
					[routerKey as unknown as string]: {
						push: spiedPush,
					},
				},
			},
		})

		// Click doesn't propagate if we don't wait here
		await flushPromises()

		await wrapper.get("a").trigger("click")

		expect(spiedPush).toHaveBeenCalledOnce()
		expect(spiedPush).toHaveBeenCalledWith(`/foo`)
	})

	it("on inner tag click", async () => {
		const spiedPush = vi.fn()

		const wrapper = mount(PrismicRichText, {
			props: {
				field: richTextFixture.link,
				serializer: {
					hyperlink: () => `<a href="/foo"><em>link</em></a>`,
				},
			},
			global: {
				provide: {
					[routerKey as unknown as string]: {
						push: spiedPush,
					},
				},
			},
		})

		// Click doesn't propagate if we don't wait here
		await flushPromises()

		await wrapper.get("a em").trigger("click")

		expect(spiedPush).toHaveBeenCalledOnce()
		expect(spiedPush).toHaveBeenCalledWith(`/foo`)
	})

	it("on deep inner tag click", async () => {
		const spiedPush = vi.fn()

		const wrapper = mount(PrismicRichText, {
			props: {
				field: richTextFixture.link,
				serializer: {
					hyperlink: () =>
						`<a href="/foo"><span><span><span><span><span><em>link<em></span></span></span></span></span></a>`,
				},
			},
			global: {
				provide: {
					[routerKey as unknown as string]: {
						push: spiedPush,
					},
				},
			},
		})

		// Click doesn't propagate if we don't wait here
		await flushPromises()

		await wrapper.get("a em").trigger("click")

		expect(spiedPush).toHaveBeenCalledOnce()
		expect(spiedPush).toHaveBeenCalledWith(`/foo`)
	})
})

it("doesn't navigate external links using Vue Router if available on click (navigation error is expected)", async () => {
	const spiedPush = vi.fn()

	const wrapper = mount(PrismicRichText, {
		props: {
			field: richTextFixture.link,
			serializer: {
				hyperlink: () =>
					`<a data-external href="https://google.com">link</a><a data-internal href="/foo">link</a>`,
			},
		},
		global: {
			provide: {
				[routerKey as unknown as string]: {
					push: spiedPush,
				},
			},
		},
	})

	// Click doesn't propagate if we don't wait here
	await flushPromises()

	await wrapper.get("a[data-external]").trigger("click")

	expect(spiedPush).not.toHaveBeenCalled()

	await wrapper.get("a[data-internal]").trigger("click")

	expect(spiedPush).toHaveBeenCalledOnce()
	expect(spiedPush).toHaveBeenCalledWith(`/foo`)
})

it("doesn't try to bind on click events when Vue Router is available when rendering a comment node", async () => {
	await expect(async () => {
		const spiedPush = vi.fn()

		mount(PrismicRichText, {
			props: {
				field: richTextFixture.link,
				wrapper: markRaw(() => null),
				serializer: {
					hyperlink: () => `<a href="/foo">link</a>`,
				},
			},
			global: {
				provide: {
					[routerKey as unknown as string]: {
						push: spiedPush,
					},
				},
			},
		})

		// Click doesn't propagate if we don't wait here
		await flushPromises()
	}).not.toThrow()
})

it("reacts to changes properly", async () => {
	const wrapper = mount(PrismicRichText, {
		props: { field: richTextFixture.en },
	})

	const firstRender = wrapper.html()

	await wrapper.setProps({
		field: [{ type: "paragraph", text: "foo", spans: [] }] as RichTextField,
	})

	const secondRender = wrapper.html()

	expect(secondRender).not.toBe(firstRender)
	expect(secondRender).toBe(
		`<div>
  <p>foo</p>
</div>`,
	)
})
