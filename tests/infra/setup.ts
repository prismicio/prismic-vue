import { STORAGE_STATE } from "../../playwright.config"
import * as content from "./content"
import { test as setup } from "./test"

setup("create repo", async ({ page, prismic }) => {
	const cookies = await page.context().cookies()
	const repositoryName = cookies.find((cookie) => cookie.name === "repository-name")?.value

	// Delete the repository of an interrupted run, or a failed setup attempt.
	if (repositoryName) await prismic.getRepo(repositoryName).delete()

	const repository = await prismic.createRepository({
		prefix: "prismicio-vue",
		defaultLocale: "en-us",
	})
	await page.context().addCookies([
		{
			name: "repository-name",
			value: repository.domain,
			domain: "localhost",
			path: "/",
		},
	])
	await page.context().storageState({ path: STORAGE_STATE })

	await repository.addSlice(content.page.slices.text)
	await repository.addSlice(content.page.slices.image)
	const pageDocument = await createPublishedDocument(content.page.model, content.page.content())

	const documentLinkID = pageDocument.id
	await createPublishedDocument(content.link.model, content.link.content({ documentLinkID }))
	await createPublishedDocument(content.image.model, content.image.content())
	await createPublishedDocument(
		content.richText.model,
		content.richText.content({ documentLinkID }),
	)
	await createPublishedDocument(content.table.model, content.table.content())

	async function createPublishedDocument(
		model: { id: string; label: string },
		data: Record<string, unknown>,
	) {
		await repository.addCustomType(model)
		const document = await repository.createDocument({
			custom_type_id: model.id,
			title: model.label,
			data,
		})
		await repository.publishDocument(document.id)
		return document
	}
})
