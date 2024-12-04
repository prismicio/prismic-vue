import { expect, it, vi } from "vitest"

import { mount } from "@vue/test-utils"

import { createPrismic } from "../src"
import { PrismicImage } from "../src/components"

it("renders nothing when passed an empty field", () => {
	const wrapper = mount(PrismicImage, {
		props: {
			field: { url: null, alt: null, copyright: null },
		},
	})

	expect(wrapper.html()).toBe("<!--v-if-->")
})

it("renders an img element with a width-based srcset by default", (ctx) => {
	const wrapper = mount(PrismicImage, {
		props: { field: ctx.mock.value.image() },
	})

	expect(wrapper.html()).toMatchInlineSnapshot(
		`"<img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=2560&amp;h=1705&amp;fit=crop" srcset="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?h=1705&amp;fit=crop&amp;width=640 640w, https://images.unsplash.com/photo-1441974231531-c6227db76b6e?h=1705&amp;fit=crop&amp;width=828 828w, https://images.unsplash.com/photo-1441974231531-c6227db76b6e?h=1705&amp;fit=crop&amp;width=1200 1200w, https://images.unsplash.com/photo-1441974231531-c6227db76b6e?h=1705&amp;fit=crop&amp;width=2048 2048w, https://images.unsplash.com/photo-1441974231531-c6227db76b6e?h=1705&amp;fit=crop&amp;width=3840 3840w" alt="Vulputate sapien nec sagittis aliquam malesuada">"`,
	)
})

it("renders a width-based srcset with given widths", (ctx) => {
	const wrapper = mount(PrismicImage, {
		props: {
			field: ctx.mock.value.image(),
			imgixParams: { sat: 100 },
			widths: [100, 200, 300],
		},
	})

	expect(wrapper.html()).toMatchInlineSnapshot(
		`"<img src="https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=4554&amp;h=3036&amp;fit=crop&amp;sat=100" srcset="https://images.unsplash.com/photo-1470770903676-69b98201ea1c?h=3036&amp;fit=crop&amp;sat=100&amp;width=100 100w, https://images.unsplash.com/photo-1470770903676-69b98201ea1c?h=3036&amp;fit=crop&amp;sat=100&amp;width=200 200w, https://images.unsplash.com/photo-1470770903676-69b98201ea1c?h=3036&amp;fit=crop&amp;sat=100&amp;width=300 300w" alt="At tellus at urna condimentum mattis pellentesque">"`,
	)
})

it("renders a width-based srcset with default widths if widths is `defaults`", (ctx) => {
	const wrapper = mount(PrismicImage, {
		props: {
			field: ctx.mock.value.image(),
			imgixParams: { sat: 100 },
			widths: "defaults",
		},
	})

	expect(wrapper.html()).toMatchInlineSnapshot(
		`"<img src="https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?w=2200&amp;h=1467&amp;fit=crop&amp;sat=100" srcset="https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?h=1467&amp;fit=crop&amp;sat=100&amp;width=640 640w, https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?h=1467&amp;fit=crop&amp;sat=100&amp;width=828 828w, https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?h=1467&amp;fit=crop&amp;sat=100&amp;width=1200 1200w, https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?h=1467&amp;fit=crop&amp;sat=100&amp;width=2048 2048w, https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?h=1467&amp;fit=crop&amp;sat=100&amp;width=3840 3840w" alt="Gravida dictum fusce ut placerat orci nulla pellentesque dignissim">"`,
	)
})

it("renders a width-based srcset with plugin's default widths if widths is `defaults`", (ctx) => {
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
		`"<img src="https://images.unsplash.com/photo-1504198266287-1659872e6590?w=4272&amp;h=2848&amp;fit=crop&amp;sat=100" srcset="https://images.unsplash.com/photo-1504198266287-1659872e6590?h=2848&amp;fit=crop&amp;sat=100&amp;width=400 400w, https://images.unsplash.com/photo-1504198266287-1659872e6590?h=2848&amp;fit=crop&amp;sat=100&amp;width=500 500w, https://images.unsplash.com/photo-1504198266287-1659872e6590?h=2848&amp;fit=crop&amp;sat=100&amp;width=600 600w" alt="Nisl vel pretium lectus quam id leo in vitae turpis massa sed">"`,
	)
})

it("renders a width-based srcset with the field's responsive views if widths is `thumbnails`", (ctx) => {
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
		`"<img src="https://images.unsplash.com/photo-1587502537745-84b86da1204f?w=6550&amp;h=4367&amp;fit=crop&amp;sat=100" srcset="https://images.unsplash.com/photo-1587502537745-84b86da1204f?h=4367&amp;fit=crop&amp;sat=100&amp;width=6550 6550w, https://images.unsplash.com/photo-1444464666168-49d633b86797?h=3234&amp;fit=crop&amp;sat=100&amp;width=4844 4844w, https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?h=4392&amp;fit=crop&amp;sat=100&amp;width=7372 7372w, https://images.unsplash.com/photo-1504198266287-1659872e6590?h=2848&amp;fit=crop&amp;sat=100&amp;width=4272 4272w" alt="Facilisis magna etiam tempor orci eu lobortis elementum nibh tellus molestie nunc non blandit">"`,
	)
})

it("renders pixel-density srcset with the given densities", (ctx) => {
	const wrapper = mount(PrismicImage, {
		props: {
			field: ctx.mock.value.image(),
			imgixParams: { sat: 100 },
			pixelDensities: [1, 2],
		},
	})

	expect(wrapper.html()).toMatchInlineSnapshot(
		`"<img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=2560&amp;h=1705&amp;fit=crop&amp;sat=100" srcset="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=2560&amp;h=1705&amp;fit=crop&amp;sat=100&amp;dpr=1 1x, https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=2560&amp;h=1705&amp;fit=crop&amp;sat=100&amp;dpr=2 2x" alt="Risus in hendrerit gravida rutrum quisque non tellus orci ac">"`,
	)
})

it("renders pixel-density srcset with default densities if pixelDensities is `defaults`", (ctx) => {
	const wrapper = mount(PrismicImage, {
		props: {
			field: ctx.mock.value.image(),
			imgixParams: { sat: 100 },
			pixelDensities: "defaults",
		},
	})

	expect(wrapper.html()).toMatchInlineSnapshot(
		`"<img src="https://images.unsplash.com/photo-1553531384-397c80973a0b?w=4335&amp;h=6502&amp;fit=crop&amp;sat=100" srcset="https://images.unsplash.com/photo-1553531384-397c80973a0b?w=4335&amp;h=6502&amp;fit=crop&amp;sat=100&amp;dpr=1 1x, https://images.unsplash.com/photo-1553531384-397c80973a0b?w=4335&amp;h=6502&amp;fit=crop&amp;sat=100&amp;dpr=2 2x, https://images.unsplash.com/photo-1553531384-397c80973a0b?w=4335&amp;h=6502&amp;fit=crop&amp;sat=100&amp;dpr=3 3x" alt="Sed augue lacus viverra vitae congue eu">"`,
	)
})

it("renders pixel-density srcset with plugin's default densities if pixelDensities is `defaults`", (ctx) => {
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
		`"<img src="https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=5616&amp;h=3744&amp;fit=crop&amp;sat=100" srcset="https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=5616&amp;h=3744&amp;fit=crop&amp;sat=100&amp;dpr=3 3x, https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=5616&amp;h=3744&amp;fit=crop&amp;sat=100&amp;dpr=4 4x" alt="Amet consectetur adipiscing elit pellentesque habitant morbi tristique">"`,
	)
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

it("uses the field's alt if given", (ctx) => {
	const wrapper = mount(PrismicImage, {
		props: { field: { ...ctx.mock.value.image(), alt: "foo" } },
	})

	expect(wrapper.html()).toContain('alt="foo"')
})

it("alt is omitted if the field does not have an alt value", (ctx) => {
	const wrapper = mount(PrismicImage, {
		props: { field: { ...ctx.mock.value.image(), alt: null } },
	})

	expect(wrapper.html()).not.toContain('alt="')
})

it("supports an explicit decorative fallback alt value if given", (ctx) => {
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

it("supports an explicit decorative alt when field has an alt value", (ctx) => {
	const wrapper = mount(PrismicImage, {
		props: {
			field: { ...ctx.mock.value.image(), alt: "foo" },
			alt: "",
		},
	})

	expect(wrapper.html()).toContain('alt=""')
})

it("supports an explicit decorative alt when field does not have an alt value", (ctx) => {
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

it("supports imgix parameters", (ctx) => {
	const wrapper = mount(PrismicImage, {
		props: {
			field: ctx.mock.value.image(),
			imgixParams: { sat: 100 },
		},
	})

	expect(wrapper.html()).toMatchInlineSnapshot(
		`"<img src="https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?w=6000&amp;h=4000&amp;fit=crop&amp;sat=100" srcset="https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?h=4000&amp;fit=crop&amp;sat=100&amp;width=640 640w, https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?h=4000&amp;fit=crop&amp;sat=100&amp;width=828 828w, https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?h=4000&amp;fit=crop&amp;sat=100&amp;width=1200 1200w, https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?h=4000&amp;fit=crop&amp;sat=100&amp;width=2048 2048w, https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?h=4000&amp;fit=crop&amp;sat=100&amp;width=3840 3840w" alt="Odio euismod lacinia at quis risus sed vulputate odio ut enim">"`,
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
