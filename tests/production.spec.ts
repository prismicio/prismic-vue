import { expect, test } from "./infra"

test("does not render the TODO component", async ({ page, warnings }) => {
	await page.goto("/SliceZone")

	const todo = page.getByTestId("todo")
	await expect(todo.getByTestId("text")).toBeVisible()
	await expect(todo.locator("[data-slice-zone-todo-component]")).toHaveCount(0)
	expect(warnings).not.toContainEqual(expect.stringContaining("Could not find a component"))
})

test("does not warn about invalid image props", async ({ page, warnings }) => {
	await page.goto("/PrismicImage")

	await expect(page.getByTestId("widths-and-pixel-densities")).toBeVisible()
	expect(warnings).toEqual([])
})
