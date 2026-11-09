import { expect, test } from "./infra"

test.beforeEach(async ({ page }) => {
	await page.goto("/PrismicLink")
})

test.describe("link fields", () => {
	test("renders an empty link as an anchor without href", async ({ page }) => {
		const link = page.getByTestId("empty")
		await expect(link).toHaveText("foo")
		await expect(link).not.toHaveAttribute("href")
	})

	test("renders an internal web link with the router", async ({ page }) => {
		const link = page.getByTestId("internal-web")
		await expect(link).toHaveAttribute("href", "/example")
		await expect(link).not.toHaveAttribute("rel")
		await expect(link).not.toHaveAttribute("target")

		await link.click()
		await expect(page).toHaveURL("/example")
		await expect(page.getByText("Not found")).toBeVisible()
	})

	test("renders an external web link", async ({ page }) => {
		const link = page.getByTestId("external-web")
		await expect(link).toHaveAttribute("href", "https://example.com")
		await expect(link).toHaveAttribute("rel", "noreferrer")
		await expect(link).not.toHaveAttribute("target")
	})

	test("renders an external web link with a blank target", async ({ page }) => {
		const link = page.getByTestId("external-web-with-target")
		await expect(link).toHaveAttribute("href", "https://example.com")
		await expect(link).toHaveAttribute("target", "_blank")
		await expect(link).toHaveAttribute("rel", "noreferrer")
	})

	for (const [testId, href] of [
		["protocol_relative", "//example.com"],
		["mailto", "mailto:hello@example.com"],
		["tel", "tel:+15555555555"],
	]) {
		test(`renders a ${testId} link as an external link`, async ({ page }) => {
			const link = page.getByTestId(testId)
			await expect(link).toHaveJSProperty("tagName", "A")
			await expect(link).toHaveAttribute("href", href)
			await expect(link).toHaveAttribute("rel", "noreferrer")
		})
	}

	test("renders a media link", async ({ page }) => {
		const link = page.getByTestId("media")
		await expect(link).toHaveAttribute(
			"href",
			/^https:\/\/images\.prismic\.io\/prismicio-next-test\/Z1eqf5bqstJ98PjU_/,
		)
		await expect(link).toHaveAttribute("rel", "noreferrer")
	})

	test("renders a document link with the route resolver", async ({ page }) => {
		const link = page.getByTestId("document")
		await expect(link).toHaveAttribute("href", "/page")
		await expect(link).not.toHaveAttribute("rel")
	})
})

test.describe("documents", () => {
	test("renders a document with a URL", async ({ page }) => {
		const link = page.getByTestId("document-prop")
		await expect(link).toHaveAttribute("href", "/page")
		await expect(link).toHaveText("foo")
	})

	test("renders a document without a URL as an anchor without href", async ({ page }) => {
		const link = page.getByTestId("unrouted-document-prop")
		await expect(link).toHaveText("foo")
		await expect(link).not.toHaveAttribute("href")
	})
})

test.describe("content", () => {
	test("renders the link's text", async ({ page }) => {
		await expect(page.getByTestId("with-text")).toHaveText("foo")
	})

	test("renders the slot over the link's text", async ({ page }) => {
		await expect(page.getByTestId("with-text-and-slot")).toHaveText("override")
	})
})

test.describe("link resolver", () => {
	test("uses the link resolver from props", async ({ page }) => {
		const link = page.getByTestId("link-resolver-prop")
		await expect(link).toHaveAttribute("href", "/resolved/page")
	})

	test("uses the link resolver from the plugin", async ({ page }) => {
		const link = page.getByTestId("link-resolver-plugin").getByRole("link")
		await expect(link).toHaveAttribute("href", "/plugin/page")
	})

	test("prefers the link resolver from props over the plugin's", async ({ page }) => {
		const link = page.getByTestId("link-resolver-prop-over-plugin").getByRole("link")
		await expect(link).toHaveAttribute("href", "/resolved/page")
	})
})

test.describe("rel", () => {
	test("uses a string rel", async ({ page }) => {
		await expect(page.getByTestId("rel-string")).toHaveAttribute("rel", "foo")
	})

	test("uses a rel derived from a function", async ({ page }) => {
		await expect(page.getByTestId("rel-function")).toHaveAttribute(
			"rel",
			JSON.stringify({ href: "https://example.com", isExternal: true }),
		)
	})
})

test.describe("components", () => {
	test("renders external links with the component from props", async ({ page }) => {
		const link = page.getByTestId("external-component-prop").locator("[data-test-link]")
		await expect(link).toHaveAttribute("to", "https://example.com")
		await expect(link).toHaveAttribute("target", "_blank")
		await expect(link).toHaveAttribute("rel", "noreferrer")
		await expect(link).toHaveText("foo")
	})

	test("renders external links with the component from the plugin", async ({ page }) => {
		const link = page.getByTestId("external-component-plugin").locator("[data-test-link]")
		await expect(link).toHaveAttribute("to", "https://example.com")
		await expect(link).toHaveAttribute("rel", "noreferrer")
	})

	test("renders internal links with the component from props", async ({ page }) => {
		const link = page.getByTestId("internal-component-prop").locator("[data-test-link]")
		await expect(link).toHaveAttribute("to", "/page")
		await expect(link).not.toHaveAttribute("rel")
	})

	test("renders internal links with the component from the plugin", async ({ page }) => {
		const link = page.getByTestId("internal-component-plugin").locator("[data-test-link]")
		await expect(link).toHaveAttribute("to", "/page")
	})
})

test("updates when the field changes", async ({ page }) => {
	const link = page.getByTestId("reactive")
	await expect(link).toHaveAttribute("href", "https://example.com")
	await expect(link).toHaveAttribute("rel", "noreferrer")

	await page.getByRole("button", { name: "Change link" }).click()
	await expect(link).toHaveAttribute("href", "/example")
	await expect(link).not.toHaveAttribute("rel")
})
