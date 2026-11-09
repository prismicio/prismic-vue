import { expect, html, test } from "./infra"

test.beforeEach(async ({ page }) => {
	await page.goto("/PrismicRichText")
})

test("renders elements from rich text", async ({ page }) => {
	expect(await html(page.getByTestId("filled"))).toBe("<p>foo</p><p>bar</p>")
})

test("renders nothing when passed an empty field", async ({ page }) => {
	await expect(page.getByTestId("filled")).not.toBeEmpty()
	await expect(page.getByTestId("empty")).toBeEmpty()
})

test("renders fallback when passed an empty field", async ({ page }) => {
	expect(await html(page.getByTestId("fallback"))).toBe("<div>fallback</div>")
})

const blocks = {
	heading1: "<h1>foo</h1>",
	heading2: "<h2>foo</h2>",
	heading3: "<h3>foo</h3>",
	heading4: "<h4>foo</h4>",
	heading5: "<h5>foo</h5>",
	heading6: "<h6>foo</h6>",
	paragraph: "<p>foo</p>",
	preformatted: "<pre>foo</pre>",
}

for (const [block, expected] of Object.entries(blocks)) {
	test.describe(block, () => {
		test("default", async ({ page }) => {
			const scope = page.getByTestId(block)
			expect(await html(scope.getByTestId("default"))).toBe(expected)
		})

		test("custom", async ({ page }) => {
			const scope = page.getByTestId(block)
			expect(await html(scope.getByTestId("custom"))).toBe('<div data-bar="true">foo</div>')
		})
	})
}

test.describe("strong", () => {
	test("default", async ({ page }) => {
		const scope = page.getByTestId("strong")
		expect(await html(scope.getByTestId("default"))).toBe("<p><strong>foo</strong></p>")
	})

	test("custom", async ({ page }) => {
		const scope = page.getByTestId("strong")
		expect(await html(scope.getByTestId("custom"))).toBe('<p><span data-bar="true">foo</span></p>')
	})
})

test.describe("em", () => {
	test("default", async ({ page }) => {
		const scope = page.getByTestId("em")
		expect(await html(scope.getByTestId("default"))).toBe("<p><em>foo</em></p>")
	})

	test("custom", async ({ page }) => {
		const scope = page.getByTestId("em")
		expect(await html(scope.getByTestId("custom"))).toBe('<p><span data-bar="true">foo</span></p>')
	})
})

test.describe("list", () => {
	test("default", async ({ page }) => {
		const scope = page.getByTestId("list")
		expect(await html(scope.getByTestId("default"))).toBe("<ul><li>foo</li><li>bar</li></ul>")
	})

	test("custom", async ({ page }) => {
		const scope = page.getByTestId("list")
		expect(await html(scope.getByTestId("custom"))).toBe(
			'<div data-bar="true"><div data-baz="true">foo</div><div data-baz="true">bar</div></div>',
		)
	})
})

test.describe("ordered list", () => {
	test("default", async ({ page }) => {
		const scope = page.getByTestId("ordered-list")
		expect(await html(scope.getByTestId("default"))).toBe("<ol><li>foo</li><li>bar</li></ol>")
	})

	test("custom", async ({ page }) => {
		const scope = page.getByTestId("ordered-list")
		expect(await html(scope.getByTestId("custom"))).toBe(
			'<div data-bar="true"><div data-baz="true">foo</div><div data-baz="true">bar</div></div>',
		)
	})
})

test.describe("image", () => {
	test("default", async ({ page }) => {
		const scope = page.getByTestId("image")
		expect(await html(scope.getByTestId("default"))).toBe(
			'<p class="block-img"><img src="https://images.prismic.io/prismicio-next-test/Z1evSZbqstJ98PkD_image.jpg?auto=format,compress" srcset="https://images.prismic.io/prismicio-next-test/Z1evSZbqstJ98PkD_image.jpg?auto=format%2Ccompress&amp;width=640 640w, https://images.prismic.io/prismicio-next-test/Z1evSZbqstJ98PkD_image.jpg?auto=format%2Ccompress&amp;width=828 828w, https://images.prismic.io/prismicio-next-test/Z1evSZbqstJ98PkD_image.jpg?auto=format%2Ccompress&amp;width=1200 1200w, https://images.prismic.io/prismicio-next-test/Z1evSZbqstJ98PkD_image.jpg?auto=format%2Ccompress&amp;width=2048 2048w, https://images.prismic.io/prismicio-next-test/Z1evSZbqstJ98PkD_image.jpg?auto=format%2Ccompress&amp;width=3840 3840w" alt="alt text" width="800" height="600"></p>',
		)
	})

	test("custom", async ({ page }) => {
		const scope = page.getByTestId("image")
		expect(await html(scope.getByTestId("custom"))).toBe(
			'<div data-bar="true" data-src="https://images.prismic.io/prismicio-next-test/Z1evSZbqstJ98PkD_image.jpg?auto=format,compress"></div>',
		)
	})
})

test.describe("embed", () => {
	test("default", async ({ page }) => {
		const scope = page.getByTestId("embed")
		expect(await html(scope.getByTestId("default"))).toBe(
			'<div data-oembed="https://example.com" data-oembed-type="link"><div>html</div></div>',
		)
	})

	test("custom", async ({ page }) => {
		const scope = page.getByTestId("embed")
		expect(await html(scope.getByTestId("custom"))).toBe(
			'<div data-bar="true" data-html="&lt;div&gt;html&lt;/div&gt;"></div>',
		)
	})
})

test.describe("hyperlink", () => {
	test("default", async ({ page }) => {
		const scope = page.getByTestId("hyperlink")
		expect(await html(scope.getByTestId("default"))).toBe(
			'<p><a href="https://example.com" target="_self" rel="noreferrer">foo</a></p>',
		)
	})

	test("renders internal links with the router", async ({ page }) => {
		const scope = page.getByTestId("hyperlink")
		const link = scope.getByTestId("internal").getByRole("link")
		await expect(link).toHaveAttribute("href", "/foo")
		await link.click()
		await expect(page).toHaveURL("/foo")
	})

	test("renders document links with the route resolver", async ({ page }) => {
		const scope = page.getByTestId("hyperlink")
		const link = scope.getByTestId("document").getByRole("link")
		await expect(link).toHaveAttribute("href", "/page")
	})

	test("uses the link resolver from props", async ({ page }) => {
		const scope = page.getByTestId("hyperlink")
		const link = scope.getByTestId("link-resolver").getByRole("link")
		await expect(link).toHaveAttribute("href", "/resolved/page")
	})

	test("custom", async ({ page }) => {
		const scope = page.getByTestId("hyperlink")
		expect(await html(scope.getByTestId("custom"))).toBe(
			'<p><span data-bar="true" data-url="https://example.com">foo</span></p>',
		)
	})

	test("renders internal links with the plugin's component", async ({ page }) => {
		const scope = page.getByTestId("hyperlink")
		const link = scope.getByTestId("custom-internal").locator("[data-test-link]")
		await expect(link).toHaveAttribute("to", "/foo")
	})

	test("renders external links with the plugin's component", async ({ page }) => {
		const scope = page.getByTestId("hyperlink")
		const link = scope.getByTestId("custom-external").locator("[data-test-link]")
		await expect(link).toHaveAttribute("to", "https://example.com")
	})
})

test.describe("label", () => {
	test("default", async ({ page }) => {
		const scope = page.getByTestId("label")
		expect(await html(scope.getByTestId("default"))).toBe('<p><span class="bar">foo</span></p>')
	})

	test("custom", async ({ page }) => {
		const scope = page.getByTestId("label")
		expect(await html(scope.getByTestId("custom"))).toBe(
			'<p><span data-bar="true" data-label="bar">foo</span></p>',
		)
	})
})

test("renders component shorthands", async ({ page }) => {
	expect(await html(page.getByTestId("shorthand"))).toBe(
		'<h1 class="heading-1">foo</h1><h3 class="heading-2">foo</h3>',
	)
})

test("renders components from the plugin", async ({ page }) => {
	const output = page.getByTestId("plugin-components")
	await expect(output.locator("[data-bar]")).toHaveText("foo")
	await expect(output.locator("h1")).toHaveCount(0)
})

test("prefers components from props over the plugin's", async ({ page }) => {
	const output = page.getByTestId("props-over-plugin-components")
	await expect(output.locator("[data-baz]")).toHaveText("foo")
	await expect(output.locator("[data-bar]")).toHaveCount(0)
})

test("updates when the field changes", async ({ page }) => {
	const output = page.getByTestId("reactive")
	expect(await html(output)).toBe("<h1>foo</h1>")

	await page.getByRole("button", { name: "Change field" }).click()
	await expect(output.locator("p")).toHaveText("foo")
	expect(await html(output)).toBe("<p>foo</p>")
})
