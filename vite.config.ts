/// <reference types="vitest/config" />
import vue from "@vitejs/plugin-vue"
import { defineConfig } from "vite"
import dts from "vite-plugin-dts"
import sdk from "vite-plugin-sdk"

export default defineConfig({
	plugins: [sdk(), vue(), dts({ include: "src/**/*.vue" })],
	// @ts-expect-error Vite 6 issue(?)
	test: {
		environment: "jsdom",
		coverage: {
			reporter: ["lcovonly", "text"],
		},
	},
})
