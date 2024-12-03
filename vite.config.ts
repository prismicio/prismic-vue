/// <reference types="vitest/config" />
import { defineConfig } from "vite"
import sdk from "vite-plugin-sdk"

export default defineConfig({
	plugins: [sdk()],
	// @ts-expect-error Vite 6 issue(?)
	test: {
		environment: "jsdom",
		coverage: {
			reporter: ["lcovonly", "text"],
		},
	},
})
