/// <reference types="vitest/config" />
import vue from "@vitejs/plugin-vue"
import { defineConfig } from "vite"

export default defineConfig({
	plugins: [vue()],
	test: {
		include: ["test-old/**/*.test.ts"],
		setupFiles: ["./test-old/__setup__"],
		typecheck: {
			enabled: true,
			checker: "vue-tsc",
		},
		coverage: {
			provider: "v8",
			reporter: ["lcovonly", "text"],
			include: ["src"],
		},
		environment: "jsdom",
	},
})
