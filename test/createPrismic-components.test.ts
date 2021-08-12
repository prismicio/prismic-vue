import test from "ava";

import { createSpiedApp } from "./__testutils__/createSpiedApp";

import { createPrismic } from "../src";

test("injects components by default", (t) => {
	const prismic = createPrismic({ endpoint: "test" });

	const spiedApp = createSpiedApp();

	prismic.install(spiedApp);

	t.true(spiedApp.component.called);
});

test("doesn't inject components if explicitely false", (t) => {
	const prismic = createPrismic({ endpoint: "test", injectComponents: false });

	const spiedApp = createSpiedApp();

	prismic.install(spiedApp);

	t.false(spiedApp.component.called);
});
