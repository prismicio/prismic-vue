import type { MockFactory } from "@prismicio/mock"
import { createMockFactory } from "@prismicio/mock"
import { beforeEach } from "vitest"

declare module "vitest" {
	export interface TestContext {
		mock: MockFactory
	}
}

beforeEach((ctx) => {
	ctx.mock = createMockFactory({ seed: ctx.task.name })
})
