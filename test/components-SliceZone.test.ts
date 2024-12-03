import { expect, it, vi } from "vitest"

import { flushPromises, mount } from "@vue/test-utils"
import type { DefineComponent } from "vue"
import { defineAsyncComponent, markRaw } from "vue"

import {
	WrapperComponent,
	createWrapperComponent,
} from "./__fixtures__/WrapperComponent"

import { createPrismic } from "../src"
import type {
	SliceComponentProps,
	SliceComponentType,
	SliceLike,
	SliceZoneLike,
	SliceZoneResolver,
} from "../src/components"
import {
	SliceZoneImpl,
	defineSliceZoneComponents,
	getSliceComponentProps,
} from "../src/components"

it("renders slice zone with correct component mapping from components", async () => {
	const Foo = createWrapperComponent<SliceComponentType>(
		"Foo",
		getSliceComponentProps(),
	)
	const Bar = createWrapperComponent<SliceComponentType>(
		"Bar",
		getSliceComponentProps(),
	)
	const Baz = createWrapperComponent<SliceComponentType>(
		"Baz",
		getSliceComponentProps(),
	)

	const wrapper = mount(SliceZoneImpl, {
		props: {
			slices: [
				{ id: "1", slice_type: "foo" },
				{ id: "2", slice_type: "bar" },
				{ id: "3", slice_type: "baz" },
			],
			components: defineSliceZoneComponents({
				foo: Foo,
				bar: defineAsyncComponent(
					() => new Promise<SliceComponentType>((res) => res(Bar)),
				),
				baz: "Baz",
			}),
		},
		global: {
			components: {
				Baz,
			},
		},
	})

	await flushPromises()

	expect(wrapper.html()).toBe(
		`<div class="wrapperComponentFoo"></div>
<div class="wrapperComponentBar"></div>
<div class="wrapperComponentBaz"></div>`,
	)
})

it("renders slice zone with correct component mapping from components with slice IDs", async () => {
	const Foo = createWrapperComponent<SliceComponentType>(
		"Foo",
		getSliceComponentProps(),
	)
	const Bar = createWrapperComponent<SliceComponentType>(
		"Bar",
		getSliceComponentProps(),
	)
	const Baz = createWrapperComponent<SliceComponentType>(
		"Baz",
		getSliceComponentProps(),
	)

	const wrapper = mount(SliceZoneImpl, {
		props: {
			slices: [
				{ slice_type: "foo", id: "foo" },
				{ slice_type: "bar", id: "bar" },
				{ slice_type: "baz", id: "baz" },
			],
			components: defineSliceZoneComponents({
				foo: Foo,
				bar: defineAsyncComponent(
					() => new Promise<SliceComponentType>((res) => res(Bar)),
				),
				baz: "Baz",
			}),
		},
		global: {
			components: {
				Baz,
			},
		},
	})

	await flushPromises()

	expect(wrapper.html()).toBe(
		`<div class="wrapperComponentFoo"></div>
<div class="wrapperComponentBar"></div>
<div class="wrapperComponentBaz"></div>`,
	)
})

// TODO: Remove in v5 when the `resolver` prop is removed.
it("renders slice zone with correct component mapping from resolver", async () => {
	const consoleWarnSpy = vi
		.spyOn(console, "warn")
		.mockImplementation(() => void 0)

	const Foo = createWrapperComponent<SliceComponentType>(
		"Foo",
		getSliceComponentProps(),
	)
	const Bar = createWrapperComponent<SliceComponentType>(
		"Bar",
		getSliceComponentProps(),
	)
	const Baz = createWrapperComponent<SliceComponentType>(
		"Baz",
		getSliceComponentProps(),
	)

	const wrapper = mount(SliceZoneImpl, {
		props: {
			slices: [
				{ id: "1", slice_type: "foo" },
				{ id: "2", slice_type: "bar" },
				{ id: "3", slice_type: "baz" },
			],
			resolver: (({ sliceName }) => {
				const components = defineSliceZoneComponents({
					foo: Foo,
					bar: defineAsyncComponent(
						() => new Promise<SliceComponentType>((res) => res(Bar)),
					),
					baz: "Baz",
				})

				return components[sliceName]
			}) as SliceZoneResolver,
		},
		global: {
			components: {
				Baz,
			},
		},
	})

	await flushPromises()

	expect(wrapper.html()).toBe(
		`<div class="wrapperComponentFoo"></div>
<div class="wrapperComponentBar"></div>
<div class="wrapperComponentBaz"></div>`,
	)

	consoleWarnSpy.mockRestore()
})

// TODO: Remove in v5 when the `resolver` prop is removed.
it("logs a deprecation warning when using a resolver only in development", async () => {
	const originalNodeEnv = process.env.NODE_ENV
	process.env.NODE_ENV = "development"

	const consoleWarnSpy = vi
		.spyOn(console, "warn")
		.mockImplementation(() => void 0)

	mount(SliceZoneImpl, {
		props: {
			slices: [],
			resolver: (() => void 0) as SliceZoneResolver,
		},
	})

	await flushPromises()

	expect(consoleWarnSpy).toHaveBeenCalledWith(
		expect.stringMatching(/the `resolver` prop is deprecated/i),
	)

	consoleWarnSpy.mockRestore()
	process.env.NODE_ENV = originalNodeEnv
})

it("supports GraphQL API", async () => {
	const Foo = createWrapperComponent<SliceComponentType>(
		"Foo",
		getSliceComponentProps(),
	)
	const Bar = createWrapperComponent<SliceComponentType>(
		"Bar",
		getSliceComponentProps(),
	)

	const wrapper = mount(SliceZoneImpl, {
		props: {
			slices: [{ type: "foo" }, { type: "bar" }],
			components: defineSliceZoneComponents({
				foo: Foo,
				bar: Bar,
			}),
		},
	})

	await flushPromises()

	expect(wrapper.html()).toBe(
		`<div class="wrapperComponentFoo"></div>
<div class="wrapperComponentBar"></div>`,
	)
})

it("supports mapped slices from @prismicio/client's mapSliceZone()", async () => {
	const Foo = createWrapperComponent<{ id: string; slice_type: string }>(
		"Foo",
		["id", "slice_type"],
	)
	const Bar = createWrapperComponent<{ id: string; slice_type: string }>(
		"Bar",
		["id", "slice_type"],
	)
	const Baz = createWrapperComponent<SliceComponentType>(
		"Baz",
		getSliceComponentProps(),
	)

	const wrapper = mount(SliceZoneImpl, {
		props: {
			slices: [
				{ __mapped: true, id: "1", slice_type: "foo", abc: "123" },
				{ __mapped: true, id: "2", slice_type: "bar", def: "456" },
				{ id: "3", slice_type: "baz" },
			],
			components: defineSliceZoneComponents({
				foo: Foo,
				bar: defineAsyncComponent(
					() => new Promise<SliceComponentType>((res) => res(Bar)),
				),
				baz: "Baz",
			}),
		},
		global: {
			components: {
				Baz,
			},
		},
	})

	await flushPromises()

	expect(wrapper.html()).toBe(
		`<div class="wrapperComponentFoo" abc="123"></div>
<div class="wrapperComponentBar" def="456"></div>
<div class="wrapperComponentBaz"></div>`,
	)
})

it("provides context to each slice", () => {
	const Foo = createWrapperComponent<SliceComponentType>(
		"Foo",
		getSliceComponentProps(),
	)
	const Bar = createWrapperComponent<SliceComponentType>(
		"Bar",
		getSliceComponentProps(),
	)

	const context = { foo: "bar" }

	const wrapper = mount(SliceZoneImpl, {
		props: {
			slices: [
				{ id: "1", slice_type: "foo" },
				{ id: "2", slice_type: "bar" },
			],
			components: defineSliceZoneComponents({
				foo: Foo,
				bar: Bar,
			}),
			context,
		},
	})

	expect(
		wrapper.getComponent(Foo as DefineComponent<SliceComponentProps>).props()
			.context,
	).toStrictEqual(context)
	expect(
		wrapper.getComponent(Bar as DefineComponent<SliceComponentProps>).props()
			.context,
	).toStrictEqual(context)
})

it("renders TODO component if component mapping is missing", () => {
	vi.stubGlobal("console", { warn: vi.fn() })

	const Foo = createWrapperComponent<SliceComponentType>(
		"Foo",
		getSliceComponentProps(),
	)

	const wrapper = mount(SliceZoneImpl, {
		props: {
			slices: [
				{ id: "1", slice_type: "foo" },
				{ id: "2", slice_type: "bar" },
				{ __mapped: true, id: "3", slice_type: "baz", abc: "123" },
			],
			components: defineSliceZoneComponents({
				foo: Foo,
			}),
		},
	})

	expect(wrapper.html()).toBe(
		`<div class="wrapperComponentFoo"></div>
<section data-slice-zone-todo-component="" data-slice-type="bar">Could not find a component for Slice type "bar"</section>
<section data-slice-zone-todo-component="" data-slice-type="baz">Could not find a component for Slice type "baz"</section>`,
	)
	expect(console.warn).toHaveBeenCalledTimes(2)
	expect(vi.mocked(console.warn).mock.calls[0][0]).toMatch(
		/could not find a component/i,
	)
	expect(vi.mocked(console.warn).mock.calls[1][0]).toMatch(
		/could not find a component/i,
	)

	vi.resetAllMocks()
})

it("renders TODO component if component mapping is missing with GraphQL API", () => {
	vi.stubGlobal("console", { warn: vi.fn() })

	const Foo = createWrapperComponent<SliceComponentType>(
		"Foo",
		getSliceComponentProps(),
	)

	const wrapper = mount(SliceZoneImpl, {
		props: {
			slices: [{ type: "foo" }, { type: "bar" }],
			components: defineSliceZoneComponents({
				foo: Foo,
			}),
		},
	})

	expect(wrapper.html()).toBe(
		`<div class="wrapperComponentFoo"></div>
<section data-slice-zone-todo-component="" data-slice-type="bar">Could not find a component for Slice type "bar"</section>`,
	)
	expect(console.warn).toHaveBeenCalledOnce()
	expect(vi.mocked(console.warn).mock.calls[0][0]).toMatch(
		/could not find a component/i,
	)

	vi.resetAllMocks()
})

it("renders plugin provided TODO component if component mapping is missing", () => {
	const Foo = createWrapperComponent<SliceComponentType>(
		"Foo",
		getSliceComponentProps(),
	)
	const Bar = createWrapperComponent<SliceComponentType>(
		"Bar",
		getSliceComponentProps(),
	)

	const prismic = createPrismic({
		endpoint: "test",
		components: { sliceZoneDefaultComponent: Bar },
	})

	const wrapper = mount(SliceZoneImpl, {
		props: {
			slices: [
				{ id: "1", slice_type: "foo" },
				{ id: "2", slice_type: "bar" },
			],
			components: defineSliceZoneComponents({
				foo: Foo,
			}),
		},
		global: {
			plugins: [prismic],
		},
	})

	expect(wrapper.html()).toBe(
		`<div class="wrapperComponentFoo"></div>
<div class="wrapperComponentBar"></div>`,
	)
})

it("renders provided TODO component over plugin provided if component mapping is missing", () => {
	const Foo = createWrapperComponent<SliceComponentType>(
		"Foo",
		getSliceComponentProps(),
	)
	const Bar = createWrapperComponent<SliceComponentType>(
		"Bar",
		getSliceComponentProps(),
	)
	const Baz = createWrapperComponent<SliceComponentType>(
		"Baz",
		getSliceComponentProps(),
	)

	const prismic = createPrismic({
		endpoint: "test",
		components: { sliceZoneDefaultComponent: Bar },
	})

	const wrapper = mount(SliceZoneImpl, {
		props: {
			slices: [
				{ id: "1", slice_type: "foo" },
				{ id: "2", slice_type: "bar" },
			],
			components: defineSliceZoneComponents({
				foo: Foo,
			}),
			defaultComponent: markRaw(Baz),
		},
		global: {
			plugins: [prismic],
		},
	})

	expect(wrapper.html()).toBe(
		`<div class="wrapperComponentFoo"></div>
<div class="wrapperComponentBaz"></div>`,
	)
})

it.skip("doesn't render TODO component in production", () => {
	const originalNodeEnv = process.env.NODE_ENV
	process.env.NODE_ENV = "production"
	const consoleWarnSpy = vi
		.spyOn(console, "warn")
		.mockImplementation(() => void 0)

	const Foo = createWrapperComponent<SliceComponentType>(
		"Foo",
		getSliceComponentProps(),
	)

	const wrapper = mount(SliceZoneImpl, {
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
	process.env.NODE_ENV = originalNodeEnv
})

it("wraps output with provided wrapper tag", () => {
	const Foo = createWrapperComponent<SliceComponentType>(
		"Foo",
		getSliceComponentProps(),
	)
	const Bar = createWrapperComponent<SliceComponentType>(
		"Bar",
		getSliceComponentProps(),
	)

	const wrapper = mount(SliceZoneImpl, {
		props: {
			slices: [
				{ id: "1", slice_type: "foo" },
				{ id: "2", slice_type: "bar" },
			],
			components: defineSliceZoneComponents({
				foo: Foo,
				bar: Bar,
			}),
			wrapper: "main",
		},
	})

	expect(wrapper.html()).toBe(
		`<main>
  <div class="wrapperComponentFoo"></div>
  <div class="wrapperComponentBar"></div>
</main>`,
	)
})

it("wraps output with provided wrapper component", () => {
	const Foo = createWrapperComponent<SliceComponentType>(
		"Foo",
		getSliceComponentProps(),
	)
	const Bar = createWrapperComponent<SliceComponentType>(
		"Bar",
		getSliceComponentProps(),
	)

	const wrapper = mount(SliceZoneImpl, {
		props: {
			slices: [
				{ id: "1", slice_type: "foo" },
				{ id: "2", slice_type: "bar" },
			],
			components: defineSliceZoneComponents({
				foo: Foo,
				bar: Bar,
			}),
			wrapper: markRaw(WrapperComponent),
		},
	})

	expect(wrapper.html()).toBe(
		`<div class="wrapperComponent">
  <div class="wrapperComponentFoo"></div>
  <div class="wrapperComponentBar"></div>
</div>`,
	)
})

it("renders nothing when invalid", () => {
	vi.stubGlobal("console", { warn: vi.fn() })

	const wrapper = mount(SliceZoneImpl, {
		props: {
			slices: null as unknown as SliceZoneLike<SliceLike>,
			components: defineSliceZoneComponents({}),
		},
	})

	expect(wrapper.html()).toBe("")
	expect(console.warn).toHaveBeenCalledOnce()
	expect(vi.mocked(console.warn).mock.calls[0][0]).toMatch(
		/Invalid prop: type check failed for prop/i,
	)

	vi.resetAllMocks()
})

it("reacts to changes properly", async () => {
	const Foo = createWrapperComponent<SliceComponentType>(
		"Foo",
		getSliceComponentProps(),
	)
	const Bar = createWrapperComponent<SliceComponentType>(
		"Bar",
		getSliceComponentProps(),
	)

	const wrapper = mount(SliceZoneImpl, {
		props: {
			slices: [
				{ id: "1", slice_type: "foo" },
				{ id: "2", slice_type: "bar" },
			],
			components: defineSliceZoneComponents({
				foo: Foo,
				bar: Bar,
			}),
		},
	})

	const firstRender = wrapper.html()

	await wrapper.setProps({
		slices: [{ id: "2", slice_type: "bar" }],
		components: defineSliceZoneComponents({
			foo: Foo,
			bar: Bar,
		}),
	})

	const secondRender = wrapper.html()

	expect(secondRender).not.toBe(firstRender)
	expect(secondRender).toBe(`<div class="wrapperComponentBar"></div>`)
})
