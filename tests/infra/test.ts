/* oxlint-disable rules-of-hooks */
import { test as base } from "@playwright/test"

import { Prismic } from "./client"

type Fixtures = {
	prismic: Prismic
	/** Warnings the page logs to the console. */
	warnings: string[]
}

export const test = base.extend<Fixtures>({
	prismic: async ({ page }, use) => {
		const prismic = new Prismic({
			baseURL: "https://prismic.io",
			auth: {
				email: process.env.E2E_PRISMIC_EMAIL,
				password: process.env.E2E_PRISMIC_PASSWORD,
			},
			request: page.request,
		})
		await use(prismic)
	},
	// Automatic, so it listens before `beforeEach` hooks navigate.
	warnings: [
		async ({ page }, use) => {
			const warnings: string[] = []
			page.on("console", (message) => {
				if (message.type() === "warning") warnings.push(message.text())
			})
			await use(warnings)
		},
		{ auto: true },
	],
})
