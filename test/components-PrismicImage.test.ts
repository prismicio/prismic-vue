import { describe, expect, it, vi } from "vitest"

import { mount } from "@vue/test-utils"

import { createPrismic } from "../src"
import { PrismicImage } from "../src/components"

describe("renders an image field", () => {
	it("empty", () => {
		const wrapper = mount(PrismicImage, {
			props: {
				field: { url: null, alt: null, copyright: null },
			},
		})

		expect(wrapper.html()).toBe("<!--v-if-->")
	})

	it("with a width-based srcset by default", (ctx) => {
		const wrapper = mount(PrismicImage, {
			props: { field: ctx.mock.value.image() },
		})

		expect(wrapper.html()).toMatchInlineSnapshot(
			`"<img src="https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=5616&amp;h=3744&amp;fit=crop" srcset="https://images.unsplash.com/photo-1426604966848-d7adac402bff?h=3744&amp;fit=crop&amp;width=640 640w, https://images.unsplash.com/photo-1426604966848-d7adac402bff?h=3744&amp;fit=crop&amp;width=828 828w, https://images.unsplash.com/photo-1426604966848-d7adac402bff?h=3744&amp;fit=crop&amp;width=1200 1200w, https://images.unsplash.com/photo-1426604966848-d7adac402bff?h=3744&amp;fit=crop&amp;width=2048 2048w, https://images.unsplash.com/photo-1426604966848-d7adac402bff?h=3744&amp;fit=crop&amp;width=3840 3840w" alt="Bibendum enim facilisis gravida neque convallis a cras semper auctor">"`,
		)
	})
})

describe("renders a width-based srcset", () => {
	it("with given widths", (ctx) => {
		const wrapper = mount(PrismicImage, {
			props: {
				field: ctx.mock.value.image(),
				imgixParams: { sat: 100 },
				widths: [100, 200, 300],
			},
		})

		expect(wrapper.html()).toMatchInlineSnapshot(
			`"<img src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=7372&amp;h=4392&amp;fit=crop&amp;sat=100" srcset="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?h=4392&amp;fit=crop&amp;sat=100&amp;width=100 100w, https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?h=4392&amp;fit=crop&amp;sat=100&amp;width=200 200w, https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?h=4392&amp;fit=crop&amp;sat=100&amp;width=300 300w" alt="Aliquet nibh praesent tristique magna sit amet purus gravida quis">"`,
		)
	})

	it("with default widths when widths is `defaults`", (ctx) => {
		const wrapper = mount(PrismicImage, {
			props: {
				field: ctx.mock.value.image(),
				imgixParams: { sat: 100 },
				widths: "defaults",
			},
		})

		expect(wrapper.html()).toMatchInlineSnapshot(
			`"<img src="https://images.unsplash.com/photo-1604537529428-15bcbeecfe4d?w=4240&amp;h=2832&amp;fit=crop&amp;sat=100" srcset="https://images.unsplash.com/photo-1604537529428-15bcbeecfe4d?h=2832&amp;fit=crop&amp;sat=100&amp;width=640 640w, https://images.unsplash.com/photo-1604537529428-15bcbeecfe4d?h=2832&amp;fit=crop&amp;sat=100&amp;width=828 828w, https://images.unsplash.com/photo-1604537529428-15bcbeecfe4d?h=2832&amp;fit=crop&amp;sat=100&amp;width=1200 1200w, https://images.unsplash.com/photo-1604537529428-15bcbeecfe4d?h=2832&amp;fit=crop&amp;sat=100&amp;width=2048 2048w, https://images.unsplash.com/photo-1604537529428-15bcbeecfe4d?h=2832&amp;fit=crop&amp;sat=100&amp;width=3840 3840w" alt="Viverra adipiscing at in tellus integer feugiat scelerisque varius morbi enim nunc">"`,
		)
	})

	it("with plugin's default widths if widths is `defaults`", (ctx) => {
		const prismic = createPrismic({
			endpoint: "test",
			components: {
				imageWidthSrcSetDefaults: [400, 500, 600],
			},
		})

		const wrapper = mount(PrismicImage, {
			props: {
				field: ctx.mock.value.image(),
				imgixParams: { sat: 100 },
				widths: "defaults",
			},
			global: { plugins: [prismic] },
		})

		expect(wrapper.html()).toMatchInlineSnapshot(
			`"<img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=2560&amp;h=1705&amp;fit=crop&amp;sat=100" srcset="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?h=1705&amp;fit=crop&amp;sat=100&amp;width=400 400w, https://images.unsplash.com/photo-1441974231531-c6227db76b6e?h=1705&amp;fit=crop&amp;sat=100&amp;width=500 500w, https://images.unsplash.com/photo-1441974231531-c6227db76b6e?h=1705&amp;fit=crop&amp;sat=100&amp;width=600 600w" alt="Non odio euismod lacinia at quis risus">"`,
		)
	})

	it("with the field's responsive views if widths is `thumbnails`", (ctx) => {
		const wrapper = mount(PrismicImage, {
			props: {
				field: {
					...ctx.mock.value.image(),
					foo: ctx.mock.value.image(),
					bar: ctx.mock.value.image(),
					baz: ctx.mock.value.image(),
				},
				imgixParams: { sat: 100 },
				widths: "thumbnails",
			},
		})

		expect(wrapper.html()).toMatchInlineSnapshot(
			`"<img src="https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=2560&amp;h=1440&amp;fit=crop&amp;sat=100" srcset="https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?h=1440&amp;fit=crop&amp;sat=100&amp;width=2560 2560w, https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?h=4000&amp;fit=crop&amp;sat=100&amp;width=6000 6000w, https://images.unsplash.com/reserve/HgZuGu3gSD6db21T3lxm_San%20Zenone.jpg?h=4253&amp;fit=crop&amp;sat=100&amp;width=6373 6373w, https://images.unsplash.com/reserve/HgZuGu3gSD6db21T3lxm_San%20Zenone.jpg?h=4253&amp;fit=crop&amp;sat=100&amp;width=6373 6373w" alt="Amet facilisis magna etiam tempor orci">"`,
		)
	})
})

describe("renders a pixel-density srcset", () => {
	it("with the given densities", (ctx) => {
		const wrapper = mount(PrismicImage, {
			props: {
				field: ctx.mock.value.image(),
				imgixParams: { sat: 100 },
				pixelDensities: [1, 2],
			},
		})

		expect(wrapper.html()).toMatchInlineSnapshot(
			`"<img src="https://images.unsplash.com/photo-1587502537745-84b86da1204f?w=6550&amp;h=4367&amp;fit=crop&amp;sat=100" srcset="https://images.unsplash.com/photo-1587502537745-84b86da1204f?w=6550&amp;h=4367&amp;fit=crop&amp;sat=100&amp;dpr=1 1x, https://images.unsplash.com/photo-1587502537745-84b86da1204f?w=6550&amp;h=4367&amp;fit=crop&amp;sat=100&amp;dpr=2 2x" alt="At auctor urna nunc id">"`,
		)
	})

	it("with default densities if pixelDensities is `defaults`", (ctx) => {
		const wrapper = mount(PrismicImage, {
			props: {
				field: ctx.mock.value.image(),
				imgixParams: { sat: 100 },
				pixelDensities: "defaults",
			},
		})

		expect(wrapper.html()).toMatchInlineSnapshot(
			`"<img src="https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?w=6000&amp;h=4000&amp;fit=crop&amp;sat=100" srcset="https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?w=6000&amp;h=4000&amp;fit=crop&amp;sat=100&amp;dpr=1 1x, https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?w=6000&amp;h=4000&amp;fit=crop&amp;sat=100&amp;dpr=2 2x, https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?w=6000&amp;h=4000&amp;fit=crop&amp;sat=100&amp;dpr=3 3x" alt="Ligula ullamcorper malesuada proin libero nunc consequat interdum varius sit amet mattis">"`,
		)
	})

	it("with plugin's default densities if pixelDensities is `defaults`", (ctx) => {
		const prismic = createPrismic({
			endpoint: "test",
			components: {
				imagePixelDensitySrcSetDefaults: [3, 4],
			},
		})

		const wrapper = mount(PrismicImage, {
			props: {
				field: ctx.mock.value.image(),
				imgixParams: { sat: 100 },
				pixelDensities: "defaults",
			},
			global: { plugins: [prismic] },
		})

		expect(wrapper.html()).toMatchInlineSnapshot(
			`"<img src="https://images.unsplash.com/photo-1504567961542-e24d9439a724?w=4608&amp;h=3456&amp;fit=crop&amp;sat=100" srcset="https://images.unsplash.com/photo-1504567961542-e24d9439a724?w=4608&amp;h=3456&amp;fit=crop&amp;sat=100&amp;dpr=3 3x, https://images.unsplash.com/photo-1504567961542-e24d9439a724?w=4608&amp;h=3456&amp;fit=crop&amp;sat=100&amp;dpr=4 4x" alt="Curabitur gravida arcu ac tortor dignissim convallis aenean et tortor at risus viverra">"`,
		)
	})
})

it("prioritizes widths prop over pixelDensities", (ctx) => {
	const wrapper = mount(PrismicImage, {
		props: {
			field: ctx.mock.value.image(),
			imgixParams: { sat: 100 },
			widths: "defaults",
			// @ts-expect-error - Purposely giving incompatible props.
			pixelDensities: "defaults",
		},
	})

	expect(wrapper.html()).toMatchInlineSnapshot(
		`"<img src="https://images.unsplash.com/photo-1604537529428-15bcbeecfe4d?w=4240&amp;h=2832&amp;fit=crop&amp;sat=100" srcset="https://images.unsplash.com/photo-1604537529428-15bcbeecfe4d?h=2832&amp;fit=crop&amp;sat=100&amp;width=640 640w, https://images.unsplash.com/photo-1604537529428-15bcbeecfe4d?h=2832&amp;fit=crop&amp;sat=100&amp;width=828 828w, https://images.unsplash.com/photo-1604537529428-15bcbeecfe4d?h=2832&amp;fit=crop&amp;sat=100&amp;width=1200 1200w, https://images.unsplash.com/photo-1604537529428-15bcbeecfe4d?h=2832&amp;fit=crop&amp;sat=100&amp;width=2048 2048w, https://images.unsplash.com/photo-1604537529428-15bcbeecfe4d?h=2832&amp;fit=crop&amp;sat=100&amp;width=3840 3840w" alt="Aliquet porttitor lacus luctus accumsan tortor posuere ac ut consequat semper viverra">"`,
	)
})

it("warns if both widths and pixelDensites are given", (ctx) => {
	// The warning only logs in "development".
	const originalNodeEnv = process.env.NODE_ENV
	process.env.NODE_ENV = "development"
	const consoleWarnSpy = vi
		.spyOn(console, "warn")
		.mockImplementation(() => void 0)

	mount(PrismicImage, {
		props: {
			field: ctx.mock.value.image(),
			imgixParams: { sat: 100 },
			widths: "defaults",
			// @ts-expect-error - Purposely giving incompatible props.
			pixelDensities: "defaults",
		},
	})

	expect(consoleWarnSpy).toHaveBeenCalledOnce()
	expect(consoleWarnSpy).toHaveBeenCalledWith(
		expect.stringMatching(
			/only one of "widths" or "pixelDensities" props can be provided/i,
		),
	)

	consoleWarnSpy.mockRestore()
	process.env.NODE_ENV = originalNodeEnv
})

describe("renders alt attribute", () => {
	it("omitted if the field does not have an alt value", (ctx) => {
		const wrapper = mount(PrismicImage, {
			props: { field: { ...ctx.mock.value.image(), alt: null } },
		})

		expect(wrapper.html()).not.toContain('alt="')
	})

	it("with the field's alt if given", (ctx) => {
		const wrapper = mount(PrismicImage, {
			props: { field: { ...ctx.mock.value.image(), alt: "foo" } },
		})

		expect(wrapper.html()).toContain('alt="foo"')
	})

	it("with an explicit decorative fallback alt value if given", (ctx) => {
		const wrapper = mount(PrismicImage, {
			props: {
				field: { ...ctx.mock.value.image(), alt: null },
				fallbackAlt: "",
			},
		})

		expect(wrapper.html()).toContain('alt=""')
	})

	it("warns if a non-decorative fallback alt value is given", (ctx) => {
		// The warning only logs in "development".
		const originalNodeEnv = process.env.NODE_ENV
		process.env.NODE_ENV = "development"
		const consoleWarnSpy = vi
			.spyOn(console, "warn")
			.mockImplementation(() => void 0)

		mount(PrismicImage, {
			props: {
				field: ctx.mock.value.image(),
				// @ts-expect-error - Purposely giving incompatible props.
				fallbackAlt: "non-decorative",
			},
		})

		expect(consoleWarnSpy).toHaveBeenCalledWith(
			expect.stringMatching(/alt-must-be-an-empty-string/i),
		)

		consoleWarnSpy.mockRestore()
		process.env.NODE_ENV = originalNodeEnv
	})

	it("with an explicit decorative alt when field has an alt value", (ctx) => {
		const wrapper = mount(PrismicImage, {
			props: {
				field: { ...ctx.mock.value.image(), alt: "foo" },
				alt: "",
			},
		})

		expect(wrapper.html()).toContain('alt=""')
	})

	it("with an explicit decorative alt when field does not have an alt value", (ctx) => {
		const wrapper = mount(PrismicImage, {
			props: {
				field: { ...ctx.mock.value.image(), alt: null },
				alt: "",
			},
		})

		expect(wrapper.html()).toContain('alt=""')
	})

	it("warns if a non-decorative alt value is given", (ctx) => {
		// The warning only logs in "development".
		const originalNodeEnv = process.env.NODE_ENV
		process.env.NODE_ENV = "development"
		const consoleWarnSpy = vi
			.spyOn(console, "warn")
			.mockImplementation(() => void 0)

		mount(PrismicImage, {
			props: {
				field: { ...ctx.mock.value.image(), alt: null },
				// @ts-expect-error - Purposely giving incompatible props.
				alt: "non-decorative",
			},
		})

		expect(consoleWarnSpy).toHaveBeenCalledWith(
			expect.stringMatching(/alt-must-be-an-empty-string/i),
		)

		consoleWarnSpy.mockRestore()
		process.env.NODE_ENV = originalNodeEnv
	})
})

describe("renders with imgix parameters", () => {
	it("basic", (ctx) => {
		const wrapper = mount(PrismicImage, {
			props: {
				field: ctx.mock.value.image(),
				imgixParams: { sat: 100 },
			},
		})

		expect(wrapper.html()).toMatchInlineSnapshot(
			`"<img src="https://images.unsplash.com/photo-1504567961542-e24d9439a724?w=4608&amp;h=3456&amp;fit=crop&amp;sat=100" srcset="https://images.unsplash.com/photo-1504567961542-e24d9439a724?h=3456&amp;fit=crop&amp;sat=100&amp;width=640 640w, https://images.unsplash.com/photo-1504567961542-e24d9439a724?h=3456&amp;fit=crop&amp;sat=100&amp;width=828 828w, https://images.unsplash.com/photo-1504567961542-e24d9439a724?h=3456&amp;fit=crop&amp;sat=100&amp;width=1200 1200w, https://images.unsplash.com/photo-1504567961542-e24d9439a724?h=3456&amp;fit=crop&amp;sat=100&amp;width=2048 2048w, https://images.unsplash.com/photo-1504567961542-e24d9439a724?h=3456&amp;fit=crop&amp;sat=100&amp;width=3840 3840w" alt="Tellus id interdum velit laoreet id donec ultrices tincidunt arcu">"`,
		)
	})

	it("allows removing existing Imgix params via the imgixParams prop", (ctx) => {
		const field = ctx.mock.value.image({
			model: ctx.mock.model.image(),
		})
		const fieldURL = new URL(field.url)
		fieldURL.searchParams.set("auto", "compress,format")
		fieldURL.searchParams.set("sat", "-100")
		fieldURL.searchParams.set("ar", "1:2")
		field.url = fieldURL.toString()

		const wrapper = mount(PrismicImage, {
			props: {
				field,
				imgixParams: { auto: undefined, sat: undefined },
			},
		})

		expect(wrapper.html()).toMatchInlineSnapshot(
			`"<img src="https://images.unsplash.com/photo-1504567961542-e24d9439a724?w=4608&amp;h=3456&amp;fit=crop&amp;ar=1%3A2" srcset="https://images.unsplash.com/photo-1504567961542-e24d9439a724?h=3456&amp;fit=crop&amp;ar=1%3A2&amp;width=640 640w, https://images.unsplash.com/photo-1504567961542-e24d9439a724?h=3456&amp;fit=crop&amp;ar=1%3A2&amp;width=828 828w, https://images.unsplash.com/photo-1504567961542-e24d9439a724?h=3456&amp;fit=crop&amp;ar=1%3A2&amp;width=1200 1200w, https://images.unsplash.com/photo-1504567961542-e24d9439a724?h=3456&amp;fit=crop&amp;ar=1%3A2&amp;width=2048 2048w, https://images.unsplash.com/photo-1504567961542-e24d9439a724?h=3456&amp;fit=crop&amp;ar=1%3A2&amp;width=3840 3840w" alt="Ac odio tempor orci dapibus ultrices in iaculis nunc sed augue">"`,
		)
	})
})

it("reacts to changes properly", async (ctx) => {
	const wrapper = mount(PrismicImage, {
		props: { field: ctx.mock.value.image() },
	})

	const firstRender = wrapper.html()

	await wrapper.setProps({
		field: ctx.mock.value.image(),
	})

	const secondRender = wrapper.html()

	expect(secondRender).not.toBe(firstRender)
	expect(secondRender).toMatchInlineSnapshot(
		`"<img src="https://images.unsplash.com/photo-1504567961542-e24d9439a724?w=4608&amp;h=3456&amp;fit=crop" srcset="https://images.unsplash.com/photo-1504567961542-e24d9439a724?h=3456&amp;fit=crop&amp;width=640 640w, https://images.unsplash.com/photo-1504567961542-e24d9439a724?h=3456&amp;fit=crop&amp;width=828 828w, https://images.unsplash.com/photo-1504567961542-e24d9439a724?h=3456&amp;fit=crop&amp;width=1200 1200w, https://images.unsplash.com/photo-1504567961542-e24d9439a724?h=3456&amp;fit=crop&amp;width=2048 2048w, https://images.unsplash.com/photo-1504567961542-e24d9439a724?h=3456&amp;fit=crop&amp;width=3840 3840w" alt="Cursus eget nunc scelerisque viverra mauris in aliquam sem fringilla">"`,
	)
})
