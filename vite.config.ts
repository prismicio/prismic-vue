import { defineConfig } from "vite";
import sdk from "vite-plugin-sdk";

export default defineConfig({
	plugins: [sdk()],
	test: {
		environment: "jsdom",
		coverage: {
			reporter: ["lcovonly", "text"],
		},
	},
});
