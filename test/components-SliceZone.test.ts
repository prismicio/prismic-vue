import { it, expect, vi } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";

import { defineAsyncComponent, DefineComponent, markRaw } from "vue";

import {
	createWrapperComponent,
	WrapperComponent,
} from "./__fixtures__/WrapperComponent";

import {
	defineSliceZoneComponents,
	getSliceComponentProps,
	SliceComponentType,
	SliceLike,
	SliceZoneLike,
	SliceZoneImpl,
	SliceZoneResolver,
} from "../src/components";
import { createPrismic } from "../src";

it("renders slice zone with correct component mapping from components", async () => {
	const Foo = createWrapperComponent<SliceComponentType>(
		"Foo",
		getSliceComponentProps(),
	);
	const Bar = createWrapperComponent<SliceComponentType>(
		"Bar",
		getSliceComponentProps(),
	);
	const Baz = createWrapperComponent<SliceComponentType>(
		"Baz",
		getSliceComponentProps(),
	);

	const wrapper = mount(SliceZoneImpl, {
		props: {
			slices: [
				{ slice_type: "foo" },
				{ slice_type: "bar" },
				{ slice_type: "baz" },
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
	});

	await flushPromises();

	expect(wrapper.html()).toBe(
		`<div class="wrapperComponentFoo"></div>
<div class="wrapperComponentBar"></div>
<div class="wrapperComponentBaz"></div>`,
	);
});

it("renders slice zone with correct component mapping from components with slice IDs", async () => {
	const Foo = createWrapperComponent<SliceComponentType>(
		"Foo",
		getSliceComponentProps(),
	);
	const Bar = createWrapperComponent<SliceComponentType>(
		"Bar",
		getSliceComponentProps(),
	);
	const Baz = createWrapperComponent<SliceComponentType>(
		"Baz",
		getSliceComponentProps(),
	);

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
	});

	await flushPromises();

	expect(wrapper.html()).toBe(
		`<div class="wrapperComponentFoo"></div>
<div class="wrapperComponentBar"></div>
<div class="wrapperComponentBaz"></div>`,
	);
});

it("renders slice zone with correct component mapping from resolver", async () => {
	const Foo = createWrapperComponent<SliceComponentType>(
		"Foo",
		getSliceComponentProps(),
	);
	const Bar = createWrapperComponent<SliceComponentType>(
		"Bar",
		getSliceComponentProps(),
	);
	const Baz = createWrapperComponent<SliceComponentType>(
		"Baz",
		getSliceComponentProps(),
	);

	const wrapper = mount(SliceZoneImpl, {
		props: {
			slices: [
				{ slice_type: "foo" },
				{ slice_type: "bar" },
				{ slice_type: "baz" },
			],
			resolver: (({ sliceName }) => {
				const components = defineSliceZoneComponents({
					foo: Foo,
					bar: defineAsyncComponent(
						() => new Promise<SliceComponentType>((res) => res(Bar)),
					),
					baz: "Baz",
				});

				return components[sliceName];
			}) as SliceZoneResolver,
		},
		global: {
			components: {
				Baz,
			},
		},
	});

	await flushPromises();

	expect(wrapper.html()).toBe(
		`<div class="wrapperComponentFoo"></div>
<div class="wrapperComponentBar"></div>
<div class="wrapperComponentBaz"></div>`,
	);
});

it("supports GraphQL API", async () => {
	const Foo = createWrapperComponent<SliceComponentType>(
		"Foo",
		getSliceComponentProps(),
	);
	const Bar = createWrapperComponent<SliceComponentType>(
		"Bar",
		getSliceComponentProps(),
	);

	const wrapper = mount(SliceZoneImpl, {
		props: {
			slices: [{ type: "foo" }, { type: "bar" }],
			components: defineSliceZoneComponents({
				foo: Foo,
				bar: Bar,
			}),
		},
	});

	await flushPromises();

	expect(wrapper.html()).toBe(
		`<div class="wrapperComponentFoo"></div>
<div class="wrapperComponentBar"></div>`,
	);
});

it("provides context to each slice", () => {
	const Foo = createWrapperComponent<SliceComponentType>(
		"Foo",
		getSliceComponentProps(),
	);
	const Bar = createWrapperComponent<SliceComponentType>(
		"Bar",
		getSliceComponentProps(),
	);

	const context = { foo: "bar" };

	const wrapper = mount(SliceZoneImpl, {
		props: {
			slices: [{ slice_type: "foo" }, { slice_type: "bar" }],
			components: defineSliceZoneComponents({
				foo: Foo,
				bar: Bar,
			}),
			context,
		},
	});

	expect(
		wrapper.getComponent(Foo as DefineComponent).props().context,
	).toStrictEqual(context);
	expect(
		wrapper.getComponent(Bar as DefineComponent).props().context,
	).toStrictEqual(context);
});

it("renders TODO component if component mapping is missing", () => {
	vi.stubGlobal("console", { warn: vi.fn() });

	const Foo = createWrapperComponent<SliceComponentType>(
		"Foo",
		getSliceComponentProps(),
	);

	const wrapper = mount(SliceZoneImpl, {
		props: {
			slices: [{ slice_type: "foo" }, { slice_type: "bar" }],
			components: defineSliceZoneComponents({
				foo: Foo,
			}),
		},
	});

	expect(wrapper.html()).toBe(
		`<div class="wrapperComponentFoo"></div>
<section data-slice-zone-todo-component="" data-slice-type="bar">Could not find a component for Slice type "bar"</section>`,
	);
	expect(console.warn).toHaveBeenCalledOnce();
	// @ts-expect-error - actually, it's there :thinking:
	expect(vi.mocked(console.warn).calls[0]).toMatch(
		/could not find a component/i,
	);

	vi.resetAllMocks();
});

it("renders TODO component if component mapping is missing with GraphQL API", () => {
	vi.stubGlobal("console", { warn: vi.fn() });

	const Foo = createWrapperComponent<SliceComponentType>(
		"Foo",
		getSliceComponentProps(),
	);

	const wrapper = mount(SliceZoneImpl, {
		props: {
			slices: [{ type: "foo" }, { type: "bar" }],
			components: defineSliceZoneComponents({
				foo: Foo,
			}),
		},
	});

	expect(wrapper.html()).toBe(
		`<div class="wrapperComponentFoo"></div>
<section data-slice-zone-todo-component="" data-slice-type="bar">Could not find a component for Slice type "bar"</section>`,
	);
	expect(console.warn).toHaveBeenCalledOnce();
	// @ts-expect-error - actually, it's there :thinking:
	expect(vi.mocked(console.warn).calls[0]).toMatch(
		/could not find a component/i,
	);

	vi.resetAllMocks();
});

it("renders plugin provided TODO component if component mapping is missing", () => {
	const Foo = createWrapperComponent<SliceComponentType>(
		"Foo",
		getSliceComponentProps(),
	);
	const Bar = createWrapperComponent<SliceComponentType>(
		"Bar",
		getSliceComponentProps(),
	);

	const prismic = createPrismic({
		endpoint: "test",
		components: { sliceZoneDefaultComponent: Bar },
	});

	const wrapper = mount(SliceZoneImpl, {
		props: {
			slices: [{ slice_type: "foo" }, { slice_type: "bar" }],
			components: defineSliceZoneComponents({
				foo: Foo,
			}),
		},
		global: {
			plugins: [prismic],
		},
	});

	expect(wrapper.html()).toBe(
		`<div class="wrapperComponentFoo"></div>
<div class="wrapperComponentBar"></div>`,
	);
});

it("renders provided TODO component over plugin provided if component mapping is missing", () => {
	const Foo = createWrapperComponent<SliceComponentType>(
		"Foo",
		getSliceComponentProps(),
	);
	const Bar = createWrapperComponent<SliceComponentType>(
		"Bar",
		getSliceComponentProps(),
	);
	const Baz = createWrapperComponent<SliceComponentType>(
		"Baz",
		getSliceComponentProps(),
	);

	const prismic = createPrismic({
		endpoint: "test",
		components: { sliceZoneDefaultComponent: Bar },
	});

	const wrapper = mount(SliceZoneImpl, {
		props: {
			slices: [{ slice_type: "foo" }, { slice_type: "bar" }],
			components: defineSliceZoneComponents({
				foo: Foo,
			}),
			defaultComponent: markRaw(Baz),
		},
		global: {
			plugins: [prismic],
		},
	});

	expect(wrapper.html()).toBe(
		`<div class="wrapperComponentFoo"></div>
<div class="wrapperComponentBaz"></div>`,
	);
});

it.skip("doesn't render TODO component in production", () => {
	// ts-eager does not allow esbuild configuration.
	// We cannot override the `process.env.NODE_ENV` inline replacement.
	// As a result, we cannot test for production currently.
});

it("wraps output with provided wrapper tag", () => {
	const Foo = createWrapperComponent<SliceComponentType>(
		"Foo",
		getSliceComponentProps(),
	);
	const Bar = createWrapperComponent<SliceComponentType>(
		"Bar",
		getSliceComponentProps(),
	);

	const wrapper = mount(SliceZoneImpl, {
		props: {
			slices: [{ slice_type: "foo" }, { slice_type: "bar" }],
			components: defineSliceZoneComponents({
				foo: Foo,
				bar: Bar,
			}),
			wrapper: "main",
		},
	});

	expect(wrapper.html()).toBe(
		`<main>
  <div class="wrapperComponentFoo"></div>
  <div class="wrapperComponentBar"></div>
</main>`,
	);
});

it("wraps output with provided wrapper component", () => {
	const Foo = createWrapperComponent<SliceComponentType>(
		"Foo",
		getSliceComponentProps(),
	);
	const Bar = createWrapperComponent<SliceComponentType>(
		"Bar",
		getSliceComponentProps(),
	);

	const wrapper = mount(SliceZoneImpl, {
		props: {
			slices: [{ slice_type: "foo" }, { slice_type: "bar" }],
			components: defineSliceZoneComponents({
				foo: Foo,
				bar: Bar,
			}),
			wrapper: markRaw(WrapperComponent),
		},
	});

	expect(wrapper.html()).toBe(
		`<div class="wrapperComponent">
  <div class="wrapperComponentFoo"></div>
  <div class="wrapperComponentBar"></div>
</div>`,
	);
});

it("renders nothing when invalid", () => {
	vi.stubGlobal("console", { warn: vi.fn() });

	const wrapper = mount(SliceZoneImpl, {
		props: {
			slices: null as unknown as SliceZoneLike<SliceLike>,
			components: defineSliceZoneComponents({}),
		},
	});

	expect(wrapper.html()).toBe("");
	expect(console.warn).toHaveBeenCalledOnce();
	// @ts-expect-error - actually, it's there :thinking:
	expect(vi.mocked(console.warn).calls[0]).toMatch(
		/Invalid prop: type check failed for prop/i,
	);

	vi.resetAllMocks();
});

it("reacts to changes properly", async () => {
	const Foo = createWrapperComponent<SliceComponentType>(
		"Foo",
		getSliceComponentProps(),
	);
	const Bar = createWrapperComponent<SliceComponentType>(
		"Bar",
		getSliceComponentProps(),
	);

	const wrapper = mount(SliceZoneImpl, {
		props: {
			slices: [{ slice_type: "foo" }, { slice_type: "bar" }],
			components: defineSliceZoneComponents({
				foo: Foo,
				bar: Bar,
			}),
		},
	});

	const firstRender = wrapper.html();

	await wrapper.setProps({
		slices: [{ slice_type: "bar" }],
		components: defineSliceZoneComponents({
			foo: Foo,
			bar: Bar,
		}),
	});

	const secondRender = wrapper.html();

	expect(secondRender).not.toBe(firstRender);
	expect(secondRender).toBe(`<div class="wrapperComponentBar"></div>`);
});
