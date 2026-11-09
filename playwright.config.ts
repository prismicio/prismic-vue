import assert from "node:assert"
import { existsSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"

import { defineConfig, devices } from "@playwright/test"

try {
	process.loadEnvFile(".env.test.local")
} catch {}

export const STORAGE_STATE = fileURLToPath(
	new URL("./tests/infra/.storage-state.json", import.meta.url),
)
if (!existsSync(STORAGE_STATE)) writeFileSync(STORAGE_STATE, JSON.stringify({}))

// https://playwright.dev/docs/test-configuration
export default defineConfig({
	testDir: "./tests",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: "html",
	use: {
		...devices["Desktop Chrome"],
		storageState: STORAGE_STATE,
		trace: "on-first-retry",
	},
	projects: [
		{
			name: "setup",
			testMatch: "setup.ts",
			teardown: "teardown",
			// Traces record request bodies, which include the account's credentials.
			use: { trace: "off" },
		},
		{
			name: "vite",
			testIgnore: "production.spec.ts",
			dependencies: ["setup"],
			use: { baseURL: "http://localhost:4321" },
		},
		{
			// Development-only warnings and fallbacks are stripped from production builds.
			name: "vite-production",
			testMatch: "production.spec.ts",
			dependencies: ["setup"],
			use: { baseURL: "http://localhost:4322" },
		},
		{
			name: "teardown",
			testMatch: "teardown.ts",
			use: { trace: "off" },
		},
	],
	webServer: [
		{
			command: "npm run --workspace vite-app dev",
			port: 4321,
			reuseExistingServer: !process.env.CI,
		},
		{
			command: "npm run --workspace vite-app build && npm run --workspace vite-app preview",
			port: 4322,
			reuseExistingServer: !process.env.CI,
		},
	],
})

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace NodeJS {
		interface ProcessEnv {
			CI: string
			E2E_PRISMIC_EMAIL: string
			E2E_PRISMIC_PASSWORD: string
		}
	}
}

assert.ok(process.env.E2E_PRISMIC_EMAIL, "Missing E2E_PRISMIC_EMAIL env variable.")
assert.ok(process.env.E2E_PRISMIC_PASSWORD, "Missing E2E_PRISMIC_PASSWORD env variable.")
