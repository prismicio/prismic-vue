import { expect, it } from "vitest"

import { type RichTextField, RichTextNodeType } from "@prismicio/client"
import { mount } from "@vue/test-utils"
import { markRaw } from "vue"

import { WrapperComponent } from "./__fixtures__/WrapperComponent"

import { PrismicText } from "../src/components"

it("renders plain text representation", () => {
	const wrapper = mount(PrismicText, {
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

	expect(wrapper.html()).toBe("Heading 1")
})

it("returns null when passed empty field", () => {
	const wrapper = mount(PrismicText, {
		props: { field: null },
	})

	expect(wrapper.html()).toBe("<!--v-if-->")
})

it("returns fallback when passed empty field", () => {
	const nullField = mount(PrismicText, {
		props: { field: null, fallback: "fallback" },
	})

	const undefinedField = mount(PrismicText, {
		props: { field: undefined, fallback: "fallback" },
	})

	const emptyField = mount(PrismicText, {
		props: { field: [], fallback: "fallback" },
	})

	expect(nullField.html()).toBe("fallback")
	expect(undefinedField.html()).toBe("fallback")
	expect(emptyField.html()).toBe("fallback")
})

it("returns fallback when passed empty field with wrapper", () => {
	const nullField = mount(PrismicText, {
		props: { field: null, fallback: "fallback", wrapper: "p" },
	})

	const undefinedField = mount(PrismicText, {
		props: { field: undefined, fallback: "fallback", wrapper: "p" },
	})

	const emptyField = mount(PrismicText, {
		props: { field: [], fallback: "fallback", wrapper: "p" },
	})

	expect(nullField.html()).toBe("<p>fallback</p>")
	expect(undefinedField.html()).toBe("<p>fallback</p>")
	expect(emptyField.html()).toBe("<p>fallback</p>")
})

it("uses provided wrapper tag", () => {
	const wrapper = mount(PrismicText, {
		props: {
			field: [
				{
					type: RichTextNodeType.heading1,
					text: "Heading 1",
					spans: [],
				},
			],
			wrapper: "p",
		},
	})

	expect(wrapper.html()).toBe("<p>Heading 1</p>")
})

it("uses provided wrapper component", () => {
	const wrapper = mount(PrismicText, {
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

	expect(wrapper.html()).toBe(`<div class="wrapperComponent">Heading 1</div>`)
})

it("throws error if passed a string-based field (e.g. Key Text or Select)", () => {
	// The error is only thrown  in "development".
	const originalNodeEnv = process.env.NODE_ENV
	process.env.NODE_ENV = "development"

	expect(() =>
		mount(PrismicText, {
			props: {
				// @ts-expect-error - We are purposely not providing a correct field.
				field: "not a Rich Text field",
				wrapper: markRaw(WrapperComponent),
			},
		}),
	).toThrowError(/prismictext-works-only-with-rich-text-and-title-fields/i)

	process.env.NODE_ENV = originalNodeEnv
})

it("reacts to changes properly", async () => {
	const wrapper = mount(PrismicText, {
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

	const firstRender = wrapper.html()

	await wrapper.setProps({
		field: [
			{ type: RichTextNodeType.paragraph, text: "foo", spans: [] },
		] as RichTextField,
	})

	const secondRender = wrapper.html()

	expect(secondRender).not.toBe(firstRender)
	expect(secondRender).toBe("foo")
})
