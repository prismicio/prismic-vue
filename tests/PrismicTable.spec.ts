import { expect, html, test } from "./infra"

test.beforeEach(async ({ page }) => {
	await page.goto("/PrismicTable")
})

test("renders a table field", async ({ page }) => {
	expect(await html(page.getByTestId("filled"))).toBe(
		"<table><thead><tr><th><p>Method</p></th><th><p>Usage</p></th></tr></thead><tbody><tr><th><p>GET</p></th><td><p>For <strong>basic retrieval</strong> of information…</p></td></tr><tr><th><p>DELETE</p></th><td><p>To <em>dest</em>roy a resource and remove…</p></td></tr></tbody></table>",
	)
})

test("renders nothing when passed an empty field", async ({ page }) => {
	await expect(page.getByTestId("filled")).not.toBeEmpty()
	await expect(page.getByTestId("empty")).toBeEmpty()
})

test("renders fallback when passed an empty field", async ({ page }) => {
	expect(await html(page.getByTestId("fallback"))).toBe("<div>fallback</div>")
})

const customTable =
	'<div class="table"><div class="head"><div class="row"><div class="header"><p>Method</p></div><div class="header"><p>Usage</p></div></div></div><div class="body"><div class="row"><div class="header"><p>GET</p></div><div class="data"><p>For <strong>basic retrieval</strong> of information…</p></div></div><div class="row"><div class="header"><p>DELETE</p></div><div class="data"><p>To <em>dest</em>roy a resource and remove…</p></div></div></div></div>'

test("renders table components from props", async ({ page }) => {
	expect(await html(page.getByTestId("custom-table"))).toBe(customTable)
})

test("renders table components from the plugin", async ({ page }) => {
	await expect(page.getByTestId("custom-table-plugin").locator(".table")).toBeVisible()
	expect(await html(page.getByTestId("custom-table-plugin").locator("> div"))).toBe(customTable)
})

test("renders cell content with rich text components", async ({ page }) => {
	expect(await html(page.getByTestId("custom-cell-content"))).toBe(
		'<table><thead><tr><th><p class="paragraph">Method</p></th><th><p class="paragraph">Usage</p></th></tr></thead><tbody><tr><th><p class="paragraph">GET</p></th><td><p class="paragraph">For <span class="strong">basic retrieval</span> of information…</p></td></tr><tr><th><p class="paragraph">DELETE</p></th><td><p class="paragraph">To <span class="em">dest</span>roy a resource and remove…</p></td></tr></tbody></table>',
	)
})

test("renders table shorthands", async ({ page }) => {
	expect(await html(page.getByTestId("shorthand-table"))).toBe(
		'<table class="table"><thead class="head"><tr class="row"><th class="header"><p>Method</p></th><th class="header"><p>Usage</p></th></tr></thead><tbody class="body"><tr class="row"><th class="header"><p>GET</p></th><td class="data"><p>For <strong>basic retrieval</strong> of information…</p></td></tr><tr class="row"><th class="header"><p>DELETE</p></th><td class="data"><p>To <em>dest</em>roy a resource and remove…</p></td></tr></tbody></table>',
	)
})

test("renders cell content with rich text shorthands", async ({ page }) => {
	expect(await html(page.getByTestId("shorthand-cell-content"))).toBe(
		'<table><thead><tr><th><p class="paragraph">Method</p></th><th><p class="paragraph">Usage</p></th></tr></thead><tbody><tr><th><p class="paragraph">GET</p></th><td><p class="paragraph">For <b>basic retrieval</b> of information…</p></td></tr><tr><th><p class="paragraph">DELETE</p></th><td><p class="paragraph">To <em>dest</em>roy a resource and remove…</p></td></tr></tbody></table>',
	)
})
