import { describe, expect, it } from "vitest"

import { type RichTextField, RichTextNodeType } from "@prismicio/client"
import { mount } from "@vue/test-utils"
import { markRaw } from "vue"

import { WrapperComponent } from "./__fixtures__/WrapperComponent"

import { PrismicText } from "../src"

describe("renders a rich text field", () => {
	it("as plain text", () => {
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

	it("as nothing when passed an empty field", () => {
		const wrapper = mount(PrismicText, {
			props: { field: [] },
		})

		expect(wrapper.html()).toBe("")
	})
})

describe("renders fallback value", () => {
	it("when passed an empty field", () => {
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
})

it("throws error if passed a string-based field (e.g. Key Text or Select)", () => {
	expect(() =>
		mount(PrismicText, {
			props: {
				// @ts-expect-error - We are purposely not providing a correct field.
				field: "not a rich text field",
				wrapper: markRaw(WrapperComponent),
			},
		}),
	).toThrowError(/prismictext-works-only-with-rich-text-and-title-fields/i)
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
