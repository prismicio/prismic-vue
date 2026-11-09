import { expect, test } from "./infra"

test.beforeEach(async ({ page }) => {
	await page.goto("/PrismicText")
})

test("renders text from rich text", async ({ page }) => {
	await expect(page.getByTestId("filled")).toHaveText("foo bar")
})

test("renders nothing when passed an empty field", async ({ page }) => {
	await expect(page.getByTestId("filled")).toHaveText("foo bar")
	await expect(page.getByTestId("empty")).toBeEmpty()
})

test("renders fallback when passed an empty field", async ({ page }) => {
	await expect(page.getByTestId("fallback")).toHaveText("foo")
})

test("supports a custom separator", async ({ page }) => {
	await expect(page.getByTestId("separator")).toHaveText("fooxbar")
})

test("throws when passed a string field", async ({ page }) => {
	await expect(page.getByTestId("keytext").getByTestId("error")).toContainText(
		"prismictext-works-only-with-rich-text-and-title-fields",
	)
})

test("updates when the field changes", async ({ page }) => {
	const text = page.getByTestId("reactive")
	await expect(text).toHaveText("foo bar")

	await page.getByRole("button", { name: "Change field" }).click()
	await expect(text).toHaveText("foo")
})
