import { mount } from "@vue/test-utils"
import { expect, it, vi } from "vitest"

import type { SliceComponentType } from "../src"
import { SliceZone, defineSliceZoneComponents, getSliceComponentProps } from "../src"
import { createWrapperComponent } from "./__fixtures__/WrapperComponent"

vi.mock("esm-env", async () => ({ DEV: false }))

it("doesn't render TODO component in production", () => {
	const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => void 0)

	const Foo = createWrapperComponent<SliceComponentType>("Foo", getSliceComponentProps())

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

	expect(wrapper.html()).toBe(`<!--prismic-slice-start:1-->
<div class="wrapperComponentFoo"></div>
<!--prismic-slice-end:1-->
<!--prismic-slice-start:2-->
<!--prismic-slice-end:2-->`)
	expect(consoleWarnSpy).not.toHaveBeenCalledWith(
		expect.stringMatching(/could not find a component/i),
		{ id: "2", slice_type: "bar" },
	)

	consoleWarnSpy.mockRestore()
})
