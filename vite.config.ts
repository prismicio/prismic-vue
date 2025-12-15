/// <reference types="vitest/config" />
import vue from "@vitejs/plugin-vue"
import { defineConfig } from "vite"

export default defineConfig({
	plugins: [vue()],
	test: {
		setupFiles: ["./test/__setup__"],
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
