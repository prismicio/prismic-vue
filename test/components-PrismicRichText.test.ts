import { describe, expect, it, vi } from "vitest"

import type { RichTextField } from "@prismicio/client"
import { RichTextNodeType } from "@prismicio/client"
import { mount } from "@vue/test-utils"
import { markRaw } from "vue"

import {
	WrapperComponent,
	createWrapperComponent,
} from "./__fixtures__/WrapperComponent"
import { richTextFixture } from "./__fixtures__/richText"

import { PrismicRichText, createPrismic } from "../src"
import { getRichTextComponentProps } from "../src/PrismicRichText/getRichTextComponentProps"

describe("renders a rich text field", () => {
	it("as components", () => {
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

		expect(wrapper.html()).toBe(`<h1>
  <!--v-if-->Heading 1
</h1>`)
	})

	it("as nothing when passed an empty field", () => {
		const wrapper = mount(PrismicRichText, {
			props: { field: [] },
		})

		expect(wrapper.html()).toBe("<!--v-if-->")
	})
})

describe("renders fallback value", () => {
	it("when passed an empty field", () => {
		const nullField = mount(PrismicRichText, {
			props: { field: null, fallback: markRaw(WrapperComponent) },
		})

		const undefinedField = mount(PrismicRichText, {
			props: { field: undefined, fallback: markRaw(WrapperComponent) },
		})

		const emptyField = mount(PrismicRichText, {
			props: { field: [], fallback: markRaw(WrapperComponent) },
		})

		expect(nullField.html()).toBe(`<div class="wrapperComponent"></div>`)
		expect(undefinedField.html()).toBe(`<div class="wrapperComponent"></div>`)
		expect(emptyField.html()).toBe(`<div class="wrapperComponent"></div>`)
	})

	it("when passed an empty field with wrapper", () => {
		const nullField = mount(PrismicRichText, {
			props: {
				field: null,
				fallback: markRaw(WrapperComponent),
				wrapper: "section",
			},
		})

		const undefinedField = mount(PrismicRichText, {
			props: {
				field: undefined,
				fallback: markRaw(WrapperComponent),
				wrapper: "section",
			},
		})

		const emptyField = mount(PrismicRichText, {
			props: {
				field: [],
				fallback: markRaw(WrapperComponent),
				wrapper: "section",
			},
		})

		expect(nullField.html()).toBe(`<section>
  <div class="wrapperComponent"></div>
</section>`)
		expect(undefinedField.html()).toBe(
			`<section>
  <div class="wrapperComponent"></div>
</section>`,
		)
		expect(emptyField.html()).toBe(
			`<section>
  <div class="wrapperComponent"></div>
</section>`,
		)
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
  <h1>
    <!--v-if-->Heading 1
  </h1>
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
  <h1>
    <!--v-if-->Heading 1
  </h1>
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
  <h1>
    <!--v-if-->Heading 1
  </h1>
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

describe("uses components serializer", () => {
	it("from plugin", () => {
		const prismic = createPrismic({
			endpoint: "test",
			components: {
				richTextComponents: {
					heading1: markRaw(
						createWrapperComponent("1", getRichTextComponentProps()),
					),
				},
			},
		})

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
			global: { plugins: [prismic] },
		})

		expect(wrapper.html()).toBe(`<div class="wrapperComponent1">
  <!--v-if-->Heading 1
</div>`)
	})

	it("from props (priority over plugin)", () => {
		const prismic = createPrismic({
			endpoint: "test",
			components: {
				richTextComponents: {
					heading1: markRaw(
						createWrapperComponent("1", getRichTextComponentProps()),
					),
				},
			},
		})

		const wrapper = mount(PrismicRichText, {
			props: {
				field: [
					{
						type: RichTextNodeType.heading1,
						text: "Heading 1",
						spans: [],
					},
				],
				components: {
					heading1: markRaw(
						createWrapperComponent("2", getRichTextComponentProps()),
					),
				},
			},
			global: { plugins: [prismic] },
		})

		expect(wrapper.html()).toBe(`<div class="wrapperComponent2">
  <!--v-if-->Heading 1
</div>`)
	})
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
	expect(secondRender).toBe(`<p>
  <!--v-if-->foo
</p>`)
})

it("is consistent with deprecated version", () => {
	const consoleWarnSpy = vi
		.spyOn(console, "warn")
		.mockImplementation(() => void 0)

	const current = mount(PrismicRichText, {
		props: {
			field: richTextFixture.en,
			wrapper: "div",
		},
	})

	const deprecated = mount(PrismicRichText, {
		props: {
			field: richTextFixture.en,
			serializer: {},
		},
	})

	expect(
		current
			.html()
			// Vue artifacts
			.replaceAll("<!--v-if-->", "")
			// We changed the way the `rel` attribute is applied
			.replaceAll(' rel="noreferrer"', "")
			// We added `srcset` attributes by default
			.replaceAll(/\ssrcset=".*?"/g, "")
			// We added `width` and `height` attributes by default
			.replaceAll(/\swidth=".*?"/g, "")
			.replaceAll(/\sheight=".*?"/g, "")
			// Minify
			.replaceAll("\n", "")
			.replaceAll("  ", ""),
	).toBe(
		deprecated
			.html()
			// We changed the way the `rel` attribute is applied
			.replaceAll(' rel="noopener noreferrer"', "")
			// We don't append copyright anymore
			.replaceAll(' copyright="Unsplash"', "")
			// Remove all other `width` and `height` attributes
			.replaceAll(/\swidth=".*?"/g, "")
			.replaceAll(/\sheight=".*?"/g, "")
			// Minify
			.replaceAll("\n", "")
			.replaceAll("  ", ""),
	)

	consoleWarnSpy.mockRestore()
})
