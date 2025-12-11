import { describe, expect, it, vi } from "vitest"

import type { RichTextField } from "@prismicio/client"
import { LinkType, RichTextNodeType } from "@prismicio/client"
import { mount } from "@vue/test-utils"
import { markRaw } from "vue"

import {
	WrapperComponent,
	createWrapperComponent,
} from "./__fixtures__/WrapperComponent"
import { richTextFixture } from "./__fixtures__/richText"

import { PrismicRichText } from "../src"
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
})

describe("uses link resolver", () => {
	it("from props", (ctx) => {
		const spiedLinkResolver = vi.fn(() => ctx.task.name)

		const wrapper = mount(PrismicRichText, {
			props: { field: richTextFixture.en, linkResolver: spiedLinkResolver },
		})

		expect(spiedLinkResolver).toHaveBeenCalled()
		expect(wrapper.html()).toMatch(`href="${ctx.task.name}"`)
	})
})

describe("uses components serializer", () => {
	it("from props", () => {
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
						createWrapperComponent(undefined, getRichTextComponentProps()),
					),
				},
			},
		})

		expect(wrapper.html()).toBe(`<div class="wrapperComponent">
  <!--v-if-->Heading 1
</div>`)
	})
})

describe("renders external links using component", () => {
	it("from props", (ctx) => {
		const wrapper = mount(PrismicRichText, {
			props: {
				field: [
					{
						type: RichTextNodeType.heading1,
						text: "Heading 1",
						spans: [
							{
								start: 0,
								end: 7,
								type: RichTextNodeType.hyperlink,
								data: {
									...ctx.mock.value.link({
										type: LinkType.Web,
										withTargetBlank: false,
									}),
									url: "https://example.com",
								},
							},
						],
					},
				],
				externalLinkComponent: markRaw(createWrapperComponent()),
			},
		})

		expect(wrapper.html()).toBe(
			`<h1>
  <div class="wrapperComponent" to="https://example.com" rel="noreferrer">
    <!--v-if-->Heading
  </div>
  <!--v-if--> 1
</h1>`,
		)
	})

	it("forwards attributes", (ctx) => {
		const wrapper = mount(PrismicRichText, {
			props: {
				field: [
					{
						type: RichTextNodeType.heading1,
						text: "Heading 1",
						spans: [
							{
								start: 0,
								end: 7,
								type: RichTextNodeType.hyperlink,
								data: {
									...ctx.mock.value.link({
										type: LinkType.Web,
										withTargetBlank: true,
									}),
									url: "https://example.com",
								},
							},
						],
					},
				],
				externalLinkComponent: markRaw(createWrapperComponent()),
			},
		})

		expect(wrapper.html()).toBe(
			`<h1>
  <div class="wrapperComponent" to="https://example.com" target="_blank" rel="noreferrer">
    <!--v-if-->Heading
  </div>
  <!--v-if--> 1
</h1>`,
		)
	})
})

describe("renders internal links using component", () => {
	it("from props", (ctx) => {
		const wrapper = mount(PrismicRichText, {
			props: {
				field: [
					{
						type: RichTextNodeType.heading1,
						text: "Heading 1",
						spans: [
							{
								start: 0,
								end: 7,
								type: RichTextNodeType.hyperlink,
								data: {
									...ctx.mock.value.link({ type: LinkType.Document }),
									url: "/bar",
								},
							},
						],
					},
				],
				internalLinkComponent: markRaw(createWrapperComponent()),
			},
		})

		expect(wrapper.html()).toBe(
			`<h1>
  <div class="wrapperComponent" to="/bar">
    <!--v-if-->Heading
  </div>
  <!--v-if--> 1
</h1>`,
		)
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
