import * as sinon from "sinon";

import { App } from "vue";

interface SpiedApp extends App {
	provide: sinon.SinonSpy;
	component: sinon.SinonSpy;
}

/**
 * Creates a simily-Vue.js app instance spied for test purposes.
 */
export const createSpiedApp = (): SpiedApp =>
	({
		provide: sinon.spy(() => null) as sinon.SinonSpy,
		config: {
			globalProperties: {},
		},
		component: sinon.spy(() => null) as sinon.SinonSpy,
	} as SpiedApp);
