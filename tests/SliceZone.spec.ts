import type { Locator } from "@playwright/test"

import { expect, test } from "./infra"

test.beforeEach(async ({ page }) => {
	await page.goto("/SliceZone")
})

const textSliceID = "text$877e9385-8cbd-4af2-bd65-f31d3a2588cf"
const imageSliceID = "image$a7f3e5f0-5726-41fc-9603-90c52e76e5d1"

test("renders a component for each slice from the REST API", async ({ page }) => {
	const output = page.getByTestId("filled")

	const text = await sliceProps(output.getByTestId("text"))
	expect(text.slice).toMatchObject({ id: textSliceID, slice_type: "text" })
	expect(text.slice.primary.content[0].text).toBe("foo")
	expect(text.index).toBe(0)
	expect(text.slices.map((slice: { id: string }) => slice.id)).toEqual([textSliceID, imageSliceID])

	const image = await sliceProps(output.getByTestId("image"))
	expect(image.slice).toMatchObject({ id: imageSliceID, slice_type: "image" })
	expect(image.index).toBe(1)
})

test("renders a component for each slice from the GraphQL API", async ({ page }) => {
	const output = page.getByTestId("graphql")

	const text = await sliceProps(output.getByTestId("text"))
	expect(text.slice.type).toBe("text")
	expect(text.slice.variation.primary.content[0].text).toBe("foo")
	expect(text.index).toBe(0)

	const image = await sliceProps(output.getByTestId("image"))
	expect(image.slice.type).toBe("image")
	expect(image.index).toBe(1)
})

test("renders slices from mapSliceZone() with their mapped props", async ({ page }) => {
	const output = page.getByTestId("mapped")

	expect(await sliceProps(output.getByTestId("text"))).toEqual({
		id: textSliceID,
		slice_type: "text",
		foo: "bar",
	})
	expect(await sliceProps(output.getByTestId("image"))).toEqual({
		id: imageSliceID,
		slice_type: "image",
		bar: "baz",
	})
})

test("renders async and globally registered components", async ({ page }) => {
	const output = page.getByTestId("async")

	expect((await sliceProps(output.getByTestId("text"))).slice.id).toBe(textSliceID)
	expect((await sliceProps(output.getByTestId("image"))).slice.id).toBe(imageSliceID)
})

test("renders nothing when passed an empty slice zone", async ({ page }) => {
	await expect(page.getByTestId("filled").getByTestId("text")).toBeVisible()
	await expect(page.getByTestId("empty")).toBeEmpty()
	await expect(page.getByTestId("invalid")).toBeEmpty()
})

test("provides context to each slice", async ({ page }) => {
	const output = page.getByTestId("context")

	expect((await sliceProps(output.getByTestId("text"))).context).toEqual({ foo: "bar" })
	expect((await sliceProps(output.getByTestId("image"))).context).toEqual({ foo: "bar" })
})

test("renders a TODO component and warns when a component is missing", async ({
	page,
	warnings,
}) => {
	const message = 'Could not find a component for Slice type "image"'

	// From the REST API, the GraphQL API, and mapSliceZone().
	for (const testId of ["todo", "todo-graphql", "todo-mapped"]) {
		const todo = page.getByTestId(testId).locator("[data-slice-zone-todo-component]")
		await expect(todo).toHaveAttribute("data-slice-type", "image")
		await expect(todo).toHaveText(message)
	}

	await expect.poll(() => warnings.filter((warning) => warning.includes(message))).toHaveLength(3)
})

test("renders the default component when a component is missing", async ({ page }) => {
	const output = page.getByTestId("default-component")

	expect((await sliceProps(output.getByTestId("default"))).slice.id).toBe(imageSliceID)
	await expect(output.locator("[data-slice-zone-todo-component]")).toHaveCount(0)
})

test("adds comment boundaries around slices with IDs", async ({ page }) => {
	const filled = page.getByTestId("filled")
	await expect
		.poll(() => getSliceComments(filled))
		.toEqual([
			`prismic-slice-start:${textSliceID}`,
			`prismic-slice-end:${textSliceID}`,
			`prismic-slice-start:${imageSliceID}`,
			`prismic-slice-end:${imageSliceID}`,
		])

	await expect(page.getByTestId("graphql").getByTestId("text")).toBeVisible()
	expect(await getSliceComments(page.getByTestId("graphql"))).toEqual([])
})

const elementNodes = [
	"<!--prismic-slice-start:element-id-->",
	{ tag: "DIV", text: "element-id" },
	"<!--prismic-slice-end:element-id-->",
]
const fragmentNodes = [
	"<!--prismic-slice-start:fragment-id-->",
	{ tag: "SPAN", text: "fragment-id-first" },
	{ tag: "SPAN", text: "fragment-id-second" },
	"<!--prismic-slice-end:fragment-id-->",
]
const emptyNodes = ["<!--prismic-slice-start:empty-id-->", "<!--prismic-slice-end:empty-id-->"]

test("keeps comment boundaries aligned when slices change", async ({ page }) => {
	const markers = page.getByTestId("markers")
	const output = markers.getByTestId("markers-output")

	await expect
		.poll(() => getSliceNodes(output))
		.toEqual([...elementNodes, ...fragmentNodes, ...emptyNodes])

	await markers.getByRole("button", { name: "Reverse" }).click()
	await expect
		.poll(() => getSliceNodes(output))
		.toEqual([...emptyNodes, ...fragmentNodes, ...elementNodes])

	await markers.getByRole("button", { name: "Remove first" }).click()
	await expect.poll(() => getSliceNodes(output)).toEqual([...fragmentNodes, ...elementNodes])

	await markers.getByRole("button", { name: "Remove first" }).click()
	await expect.poll(() => getSliceNodes(output)).toEqual(elementNodes)

	await markers.getByRole("button", { name: "Remove first" }).click()
	await expect.poll(() => getSliceNodes(output)).toEqual([])
})

test("replaces comment boundaries when slice IDs change", async ({ page }) => {
	const markers = page.getByTestId("markers")
	const output = markers.getByTestId("markers-output")

	await expect
		.poll(() => getSliceNodes(output))
		.toEqual([...elementNodes, ...fragmentNodes, ...emptyNodes])

	await markers.getByRole("button", { name: "Replace IDs" }).click()
	await expect
		.poll(() => getSliceNodes(output))
		.toEqual([
			"<!--prismic-slice-start:element-id-updated-->",
			{ tag: "DIV", text: "element-id-updated" },
			"<!--prismic-slice-end:element-id-updated-->",
			"<!--prismic-slice-start:fragment-id-updated-->",
			{ tag: "SPAN", text: "fragment-id-updated-first" },
			{ tag: "SPAN", text: "fragment-id-updated-second" },
			"<!--prismic-slice-end:fragment-id-updated-->",
			"<!--prismic-slice-start:empty-id-updated-->",
			"<!--prismic-slice-end:empty-id-updated-->",
		])
})

// oxlint-disable-next-line typescript/no-explicit-any
async function sliceProps(locator: Locator): Promise<any> {
	return JSON.parse((await locator.textContent()) ?? "")
}

function getSliceNodes(locator: Locator) {
	return locator.evaluate((element) =>
		Array.from(element.childNodes)
			.map((node) => {
				// Ignore Vue's placeholder comments.
				if (node instanceof Element) return { tag: node.tagName, text: node.textContent }
				if (node instanceof Text) return node.data.trim() || null
				if (node instanceof Comment && node.data.startsWith("prismic-slice-")) {
					return `<!--${node.data}-->`
				}

				return null
			})
			.filter((node) => node !== null),
	)
}

function getSliceComments(locator: Locator) {
	return locator.evaluate((element) => {
		const comments: string[] = []
		const walker = document.createTreeWalker(element, NodeFilter.SHOW_COMMENT)

		while (walker.nextNode()) {
			const value = walker.currentNode.textContent
			if (value?.startsWith("prismic-slice-")) comments.push(value)
		}

		return comments
	})
}
