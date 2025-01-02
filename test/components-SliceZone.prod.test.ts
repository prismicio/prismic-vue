import { expect, it, vi } from "vitest"

import { mount } from "@vue/test-utils"

import { createWrapperComponent } from "./__fixtures__/WrapperComponent"

import type { SliceComponentType } from "../src"
import {
	SliceZone,
	defineSliceZoneComponents,
	getSliceComponentProps,
} from "../src"

vi.mock("esm-env", async () => ({ DEV: false }))

it("doesn't render TODO component in production", () => {
	const consoleWarnSpy = vi
		.spyOn(console, "warn")
		.mockImplementation(() => void 0)

	const Foo = createWrapperComponent<SliceComponentType>(
		"Foo",
		getSliceComponentProps(),
	)

	const wrapper = mount(SliceZone, {
		props: {
			slices: [
				{ id: "1", slice_type: "foo" },
				{ id: "2", slice_type: "bar" },
			],
			components: defineSliceZoneComponents({
				foo: Foo,
			}),
		},
	})

	expect(wrapper.html()).toBe(`<div class="wrapperComponentFoo"></div>`)
	expect(consoleWarnSpy).not.toHaveBeenCalledWith(
		expect.stringMatching(/could not find a component/i),
		{ id: "2", slice_type: "bar" },
	)

	consoleWarnSpy.mockRestore()
})
