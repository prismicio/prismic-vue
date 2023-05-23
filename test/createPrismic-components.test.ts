import { Mock, expect, it, vi } from "vitest";

import { App } from "vue";

import { createPrismic } from "../src";

interface SpiedApp extends App {
	provide: Mock;
	component: Mock;
}

/**
 * Creates a simily-Vue.js app instance spied for test purposes.
 */
const createSpiedApp = (): SpiedApp =>
	({
		provide: vi.fn(() => null),
		config: {
			globalProperties: {},
		},
		component: vi.fn(() => null),
	} as SpiedApp);

it("injects components by default", () => {
	const prismic = createPrismic({ endpoint: "test" });

	const spiedApp = createSpiedApp();

	prismic.install(spiedApp);

	expect(spiedApp.component).toHaveBeenCalled();
});

it("doesn't inject components if explicitely false", () => {
	const prismic = createPrismic({ endpoint: "test", injectComponents: false });

	const spiedApp = createSpiedApp();

	prismic.install(spiedApp);

	expect(spiedApp.component).not.toHaveBeenCalled();
});
