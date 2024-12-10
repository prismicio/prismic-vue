import { describe, expect, it, vi } from "vitest"

import { flushPromises, mount } from "@vue/test-utils"
import type { DefineComponent } from "vue"
import { defineAsyncComponent, markRaw } from "vue"

import {
	WrapperComponent,
	createWrapperComponent,
} from "./__fixtures__/WrapperComponent"

import type {
	SliceComponentProps,
	SliceComponentType,
	SliceLike,
	SliceZoneLike,
} from "../src"
import {
	SliceZone,
	createPrismic,
	defineSliceZoneComponents,
	getSliceComponentProps,
} from "../src"

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

describe("renders a slice zone", () => {
	it("from the REST API", async () => {
		const wrapper = mount(SliceZone, {
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

	it("from the GraphQL API", async () => {
		const wrapper = mount(SliceZone, {
			props: {
				slices: [{ type: "foo" }, { type: "bar" }, { type: "baz" }],
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

	it("from @prismicio/client's mapSliceZone()", async () => {
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

		const wrapper = mount(SliceZone, {
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

	it("as nothing when invalid", () => {
		const wrapper = mount(SliceZone, {
			props: {
				slices: null as unknown as SliceZoneLike<SliceLike>,
				components: defineSliceZoneComponents({}),
			},
		})

		expect(wrapper.html()).toBe("<!--v-if-->")
	})
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

	const wrapper = mount(SliceZone, {
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

describe("renders TODO component if component mapping is missing", () => {
	it.skip("with the REST API", () => {
		const originalNodeEnv = process.env.NODE_ENV
		process.env.NODE_ENV = "development"
		vi.stubGlobal("console", { warn: vi.fn() })

		const Foo = createWrapperComponent<SliceComponentType>(
			"Foo",
			getSliceComponentProps(),
		)

		const wrapper = mount(SliceZone, {
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
		process.env.NODE_ENV = originalNodeEnv
	})

	it.skip("with the GraphQL API", () => {
		const originalNodeEnv = process.env.NODE_ENV
		process.env.NODE_ENV = "development"
		vi.stubGlobal("console", { warn: vi.fn() })

		const Foo = createWrapperComponent<SliceComponentType>(
			"Foo",
			getSliceComponentProps(),
		)

		const wrapper = mount(SliceZone, {
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
		process.env.NODE_ENV = originalNodeEnv
	})

	it("from plugin", () => {
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
			global: {
				plugins: [prismic],
			},
		})

		expect(wrapper.html()).toBe(
			`<div class="wrapperComponentFoo"></div>
<div class="wrapperComponentBar"></div>`,
		)
	})

	it("from props (priority over plugin)", () => {
		const prismic = createPrismic({
			endpoint: "test",
			components: { sliceZoneDefaultComponent: Bar },
		})

		const wrapper = mount(SliceZone, {
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

	it("doesn't render TODO component in production", () => {
		const originalNodeEnv = process.env.NODE_ENV
		process.env.NODE_ENV = "production"
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
		process.env.NODE_ENV = originalNodeEnv
	})
})

describe("renders with wrapper", () => {
	it("tag", () => {
		const Foo = createWrapperComponent<SliceComponentType>(
			"Foo",
			getSliceComponentProps(),
		)
		const Bar = createWrapperComponent<SliceComponentType>(
			"Bar",
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

	it("component", () => {
		const Foo = createWrapperComponent<SliceComponentType>(
			"Foo",
			getSliceComponentProps(),
		)
		const Bar = createWrapperComponent<SliceComponentType>(
			"Bar",
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

	it("forwards attributes to wrapper", () => {
		const Foo = createWrapperComponent<SliceComponentType>(
			"Foo",
			getSliceComponentProps(),
		)
		const Bar = createWrapperComponent<SliceComponentType>(
			"Bar",
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
					bar: Bar,
				}),
				wrapper: "main",
			},
			attrs: {
				class: "foo",
			},
		})

		expect(wrapper.html()).toBe(
			`<main class="foo">
  <div class="wrapperComponentFoo"></div>
  <div class="wrapperComponentBar"></div>
</main>`,
		)
	})
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

	const wrapper = mount(SliceZone, {
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
