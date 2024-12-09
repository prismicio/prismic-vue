import { beforeEach } from "vitest"

import type { MockFactory } from "@prismicio/mock"
import { createMockFactory } from "@prismicio/mock"

declare module "vitest" {
	export interface TestContext {
		mock: MockFactory
	}
}

beforeEach((ctx) => {
	ctx.mock = createMockFactory({ seed: ctx.task.name })
})
