import { expect, test } from "./infra"

test.beforeEach(async ({ page }) => {
	await page.goto("/PrismicImage")
})

const src =
	"https://images.prismic.io/prismicio-next-test/Z1evSZbqstJ98PkD_image.jpg?auto=format,compress"
const srcBase =
	"https://images.prismic.io/prismicio-next-test/Z1evSZbqstJ98PkD_image.jpg?auto=format%2Ccompress"

function widthSrcSet(widths: number[], base = srcBase) {
	return widths.map((width) => `${base}&width=${width} ${width}w`).join(", ")
}

function densitySrcSet(densities: number[]) {
	return densities.map((density) => `${srcBase}&dpr=${density} ${density}x`).join(", ")
}

test("renders an image field with a width-based srcset by default", async ({ page }) => {
	const image = page.getByTestId("filled")
	await expect(image).toHaveAttribute("src", src)
	await expect(image).toHaveAttribute("srcset", widthSrcSet([640, 828, 1200, 2048, 3840]))
	await expect(image).toHaveAttribute("alt", "alt text")
	await expect(image).toHaveAttribute("width", "800")
	await expect(image).toHaveAttribute("height", "600")
})

test("renders nothing when passed an empty field", async ({ page }) => {
	await expect(page.getByTestId("filled")).toBeVisible()
	await expect(page.getByTestId("empty")).toHaveCount(0)
})

test.describe("srcset", () => {
	test("uses the given widths", async ({ page }) => {
		const image = page.getByTestId("widths")
		await expect(image).toHaveAttribute("srcset", widthSrcSet([100, 200, 300]))
	})

	test('uses default widths when widths is "defaults"', async ({ page }) => {
		const image = page.getByTestId("default-widths")
		await expect(image).toHaveAttribute("srcset", widthSrcSet([640, 828, 1200, 2048, 3840]))
	})

	test('uses the field\'s responsive views when widths is "thumbnails"', async ({ page }) => {
		const image = page.getByTestId("thumbnail-widths")
		await expect(image).toHaveAttribute(
			"srcset",
			[
				`${srcBase}&width=800 800w`,
				`${srcBase}&rect=0%2C33%2C800%2C533&width=600 600w`,
				`${srcBase}&rect=0%2C0%2C800%2C600&width=800 800w`,
			].join(", "),
		)
	})

	test("uses the given pixel densities", async ({ page }) => {
		const image = page.getByTestId("pixel-densities")
		await expect(image).toHaveAttribute("srcset", densitySrcSet([1, 2]))
	})

	test('uses default pixel densities when pixelDensities is "defaults"', async ({ page }) => {
		const image = page.getByTestId("default-pixel-densities")
		await expect(image).toHaveAttribute("srcset", densitySrcSet([1, 2, 3]))
	})

	test("prefers widths over pixel densities, and warns", async ({ page, warnings }) => {
		const image = page.getByTestId("widths-and-pixel-densities")
		await expect(image).toHaveAttribute("srcset", widthSrcSet([640, 828, 1200, 2048, 3840]))
		expect(warnings).toContainEqual(
			expect.stringMatching(/only one of "widths" or "pixelDensities" props can be provided/i),
		)
	})
})

test.describe("alt", () => {
	test("renders the field's alt text", async ({ page }) => {
		await expect(page.getByTestId("with-alt")).toHaveAttribute("alt", "alt text")
	})

	test("omits alt when the field has none", async ({ page }) => {
		await expect(page.getByTestId("without-alt")).not.toHaveAttribute("alt")
	})

	test("renders a decorative fallback alt", async ({ page }) => {
		await expect(page.getByTestId("fallback-alt")).toHaveAttribute("alt", "")
	})

	test("renders a decorative alt over the field's alt", async ({ page }) => {
		await expect(page.getByTestId("decorative-alt-with-alt")).toHaveAttribute("alt", "")
		await expect(page.getByTestId("decorative-alt-without-alt")).toHaveAttribute("alt", "")
	})

	test("warns when alt or fallbackAlt is not decorative", async ({ page, warnings }) => {
		await expect(page.getByTestId("invalid-alt")).toBeVisible()
		const altWarnings = warnings.filter((warning) => /alt-must-be-an-empty-string/.test(warning))
		expect(altWarnings.some((warning) => warning.includes('The "alt" prop'))).toBe(true)
		expect(altWarnings.some((warning) => warning.includes('The "fallbackAlt" prop'))).toBe(true)
	})
})

test.describe("dimensions", () => {
	test("uses number width and height", async ({ page }) => {
		const image = page.getByTestId("number-dimensions")
		await expect(image).toHaveAttribute("width", "100")
		await expect(image).toHaveAttribute("height", "100")
	})

	test("uses string width and height", async ({ page }) => {
		const image = page.getByTestId("string-dimensions")
		await expect(image).toHaveAttribute("width", "100")
		await expect(image).toHaveAttribute("height", "100")
	})

	test("uses the field's dimensions when width and height are not numbers", async ({ page }) => {
		const image = page.getByTestId("nan-dimensions")
		await expect(image).toHaveAttribute("width", "800")
		await expect(image).toHaveAttribute("height", "600")
	})

	test("infers the height from the width", async ({ page }) => {
		const image = page.getByTestId("width-only")
		await expect(image).toHaveAttribute("width", "100")
		await expect(image).toHaveAttribute("height", "75")
	})

	test("infers the width from the height", async ({ page }) => {
		const image = page.getByTestId("height-only")
		await expect(image).toHaveAttribute("width", "133")
		await expect(image).toHaveAttribute("height", "100")
	})
})

test.describe("imgix parameters", () => {
	test("adds imgix parameters", async ({ page }) => {
		const image = page.getByTestId("imgix")
		await expect(image).toHaveAttribute("src", `${srcBase}&sat=-100`)
		await expect(image).toHaveAttribute(
			"srcset",
			widthSrcSet([640, 828, 1200, 2048, 3840], `${srcBase}&sat=-100`),
		)
	})

	test("removes imgix parameters set to undefined", async ({ page }) => {
		const image = page.getByTestId("imgix-remove")
		const imageSrc = await image.getAttribute("src")
		expect(new URL(imageSrc!).searchParams.has("auto")).toBe(false)
	})
})

test("updates when the field changes", async ({ page }) => {
	const image = page.getByTestId("reactive")
	await expect(image).toHaveAttribute("width", "800")

	await page.getByRole("button", { name: "Change image" }).click()
	await expect(image).toHaveAttribute("width", "300")
	await expect(image).toHaveAttribute("height", "400")
	await expect(image).toHaveAttribute("src", /rect=175%2C0%2C450%2C600/)
})
