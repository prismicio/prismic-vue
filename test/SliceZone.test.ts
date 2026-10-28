import { flushPromises, mount } from "@vue/test-utils"
import { describe, expect, it, vi } from "vitest"
import type { DefineComponent } from "vue"
import { defineAsyncComponent, h, markRaw } from "vue"

import type { SliceComponentProps, SliceComponentType, SliceLike, SliceZoneLike } from "../src"
import { SliceZone, defineSliceZoneComponents, getSliceComponentProps } from "../src"
import { createWrapperComponent } from "./__fixtures__/WrapperComponent"

const Foo = createWrapperComponent<SliceComponentType>("Foo", getSliceComponentProps())
const Bar = createWrapperComponent<SliceComponentType>("Bar", getSliceComponentProps())
const Baz = createWrapperComponent<SliceComponentType>("Baz", getSliceComponentProps())

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
					bar: defineAsyncComponent(() => new Promise<SliceComponentType>((res) => res(Bar))),
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
			`<!--prismic-slice-start:1-->
<div class="wrapperComponentFoo"></div>
<!--prismic-slice-end:1-->
<!--prismic-slice-start:2-->
<div class="wrapperComponentBar"></div>
<!--prismic-slice-end:2-->
<!--prismic-slice-start:3-->
<div class="wrapperComponentBaz"></div>
<!--prismic-slice-end:3-->`,
		)
	})

	it("from the GraphQL API", async () => {
		const wrapper = mount(SliceZone, {
			props: {
				slices: [{ type: "foo" }, { type: "bar" }, { type: "baz" }],
				components: defineSliceZoneComponents({
					foo: Foo,
					bar: defineAsyncComponent(() => new Promise<SliceComponentType>((res) => res(Bar))),
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
		const Foo = createWrapperComponent<{ id: string; slice_type: string }>("Foo", [
			"id",
			"slice_type",
		])
		const Bar = createWrapperComponent<{ id: string; slice_type: string }>("Bar", [
			"id",
			"slice_type",
		])
		const Baz = createWrapperComponent<SliceComponentType>("Baz", getSliceComponentProps())

		const wrapper = mount(SliceZone, {
			props: {
				slices: [
					{ __mapped: true, id: "1", slice_type: "foo", abc: "123" },
					{ __mapped: true, id: "2", slice_type: "bar", def: "456" },
					{ id: "3", slice_type: "baz" },
				],
				components: defineSliceZoneComponents({
					foo: Foo,
					bar: defineAsyncComponent(() => new Promise<SliceComponentType>((res) => res(Bar))),
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
			`<!--prismic-slice-start:1-->
<div class="wrapperComponentFoo" abc="123"></div>
<!--prismic-slice-end:1-->
<!--prismic-slice-start:2-->
<div class="wrapperComponentBar" def="456"></div>
<!--prismic-slice-end:2-->
<!--prismic-slice-start:3-->
<div class="wrapperComponentBaz"></div>
<!--prismic-slice-end:3-->`,
		)
	})

	it("as nothing when invalid", () => {
		const wrapper = mount(SliceZone, {
			props: {
				slices: null as unknown as SliceZoneLike<SliceLike>,
				components: defineSliceZoneComponents({}),
			},
		})

		expect(wrapper.html()).toBe("")
	})
})

it("provides context to each slice", () => {
	const Foo = createWrapperComponent<SliceComponentType>("Foo", getSliceComponentProps())
	const Bar = createWrapperComponent<SliceComponentType>("Bar", getSliceComponentProps())

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
		wrapper.getComponent(Foo as DefineComponent<SliceComponentProps>).props().context,
	).toStrictEqual(context)
	expect(
		wrapper.getComponent(Bar as DefineComponent<SliceComponentProps>).props().context,
	).toStrictEqual(context)
})

describe("renders TODO component if component mapping is missing", () => {
	it("with the REST API", () => {
		vi.stubGlobal("console", { warn: vi.fn() })

		const Foo = createWrapperComponent<SliceComponentType>("Foo", getSliceComponentProps())

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
			`<!--prismic-slice-start:1-->
<div class="wrapperComponentFoo"></div>
<!--prismic-slice-end:1-->
<!--prismic-slice-start:2-->
<section data-slice-zone-todo-component="" data-slice-type="bar">Could not find a component for Slice type "bar"</section>
<!--prismic-slice-end:2-->
<!--prismic-slice-start:3-->
<section data-slice-zone-todo-component="" data-slice-type="baz">Could not find a component for Slice type "baz"</section>
<!--prismic-slice-end:3-->`,
		)
		expect(console.warn).toHaveBeenCalledTimes(2)
		expect(vi.mocked(console.warn).mock.calls[0][0]).toMatch(/could not find a component/i)
		expect(vi.mocked(console.warn).mock.calls[1][0]).toMatch(/could not find a component/i)

		vi.resetAllMocks()
	})

	it("with the GraphQL API", () => {
		vi.stubGlobal("console", { warn: vi.fn() })

		const Foo = createWrapperComponent<SliceComponentType>("Foo", getSliceComponentProps())

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
		expect(vi.mocked(console.warn).mock.calls[0][0]).toMatch(/could not find a component/i)

		vi.resetAllMocks()
	})

	it("from props", () => {
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
		})

		expect(wrapper.html()).toBe(
			`<!--prismic-slice-start:1-->
<div class="wrapperComponentFoo"></div>
<!--prismic-slice-end:1-->
<!--prismic-slice-start:2-->
<div class="wrapperComponentBaz"></div>
<!--prismic-slice-end:2-->`,
		)
	})
})

it("reacts to changes properly", async () => {
	const Foo = createWrapperComponent<SliceComponentType>("Foo", getSliceComponentProps())
	const Bar = createWrapperComponent<SliceComponentType>("Bar", getSliceComponentProps())

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
	expect(secondRender).toBe(`<!--prismic-slice-start:2-->
<div class="wrapperComponentBar"></div>
<!--prismic-slice-end:2-->`)
})

it("keeps fragment and empty Slice boundaries together through reordering and removal", async () => {
	const slices = [
		{ id: "fragment", slice_type: "fragment" },
		{ id: "empty", slice_type: "empty" },
	]
	const fragmentHTML =
		"<!--prismic-slice-start:fragment--><span>first</span><span>second</span><!--prismic-slice-end:fragment-->"
	const emptyHTML = "<!--prismic-slice-start:empty--><!--prismic-slice-end:empty-->"
	const wrapper = mount(SliceZone, {
		props: {
			slices,
			components: {
				fragment: () => [h("span", "first"), h("span", "second")],
				empty: () => null,
			},
		},
	})
	const container: Element = wrapper.element
	const html = () => container.innerHTML.replaceAll("<!---->", "")
	try {
		expect(html()).toBe(fragmentHTML + emptyHTML)

		await wrapper.setProps({ slices: slices.toReversed() })
		expect(html()).toBe(emptyHTML + fragmentHTML)

		await wrapper.setProps({ slices: [slices[0]] })
		expect(html()).toBe(fragmentHTML)

		await wrapper.setProps({ slices: [] })
		expect(html()).toBe("")
	} finally {
		wrapper.unmount()
	}
})
