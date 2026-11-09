import { STORAGE_STATE } from "../../playwright.config"
import { test as teardown } from "./test"

teardown("delete repo", async ({ page, prismic }) => {
	const cookies = await page.context().cookies()
	const repositoryName = cookies.find((cookie) => cookie.name === "repository-name")?.value
	if (!repositoryName) return

	await prismic.getRepo(repositoryName).delete()
	await page.context().clearCookies({ name: "repository-name" })
	await page.context().storageState({ path: STORAGE_STATE })
})
