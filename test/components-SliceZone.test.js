import test from "ava";
import * as sinon from "sinon";
import { createLocalVue, mount } from "@vue/test-utils";
import Vue from "vue";

import {
	createWrapperComponent,
	WrapperComponent,
} from "./__fixtures__/WrapperComponent";

import {
	getSliceComponentProps,
	defineSliceZoneComponents,
	SliceZone as SliceZoneImpl,
} from "../src/components/SliceZone";
import { sleep } from "./__testutils__/sleep";

const SliceZone = Vue.component("SliceZone", SliceZoneImpl);

test("renders slice zone with correct component mapping from components", async (t) => {
	const Foo = createWrapperComponent("Foo", getSliceComponentProps());
	const Bar = createWrapperComponent("Bar", getSliceComponentProps());
	const Baz = createWrapperComponent("Baz", getSliceComponentProps());

	const localVue = createLocalVue();
	// eslint-disable-next-line vue/multi-word-component-names
	localVue.component("Baz", Baz);

	const wrapper = mount(SliceZone, {
		propsData: {
			slices: [
				{ slice_type: "foo" },
				{ slice_type: "bar" },
				{ slice_type: "baz" },
			],
			components: defineSliceZoneComponents({
				foo: Foo,
				bar: () => new Promise((res) => res(Bar)),
				baz: "Baz",
			}),
		},
		localVue,
	});

	await sleep();

	t.is(
		wrapper.html(),
		`<div>
  <div class="wrapperComponentFoo"></div>
  <div class="wrapperComponentBar"></div>
  <div class="wrapperComponentBaz"></div>
</div>`,
	);
});

test("renders slice zone with correct component mapping from resolver", async (t) => {
	const Foo = createWrapperComponent("Foo", getSliceComponentProps());
	const Bar = createWrapperComponent("Bar", getSliceComponentProps());
	const Baz = createWrapperComponent("Baz", getSliceComponentProps());

	const localVue = createLocalVue();
	// eslint-disable-next-line vue/multi-word-component-names
	localVue.component("Baz", Baz);

	const wrapper = mount(SliceZone, {
		propsData: {
			slices: [
				{ slice_type: "foo" },
				{ slice_type: "bar" },
				{ slice_type: "baz" },
			],
			resolver: ({ sliceName }) => {
				const components = defineSliceZoneComponents({
					foo: Foo,
					bar: () => new Promise((res) => res(Bar)),
					baz: "Baz",
				});

				return components[sliceName];
			},
		},
		localVue,
	});

	await sleep();

	t.is(
		wrapper.html(),
		`<div>
  <div class="wrapperComponentFoo"></div>
  <div class="wrapperComponentBar"></div>
  <div class="wrapperComponentBaz"></div>
</div>`,
	);
});

test.serial("provides context to each slice", (t) => {
	const consoleErrorStub = sinon.stub(console, "error");

	const Foo = createWrapperComponent("Foo", getSliceComponentProps());
	const Bar = createWrapperComponent("Bar", getSliceComponentProps());

	const context = { foo: "bar" };

	mount(SliceZone, {
		propsData: {
			slices: [{ slice_type: "foo" }, { slice_type: "bar" }],
			components: defineSliceZoneComponents({
				foo: Foo,
				bar: Bar,
			}),
			context,
		},
	});

	// Checks for the render not to throw invalid prop warning
	t.is(consoleErrorStub.callCount, 0);

	consoleErrorStub.restore();
});

test.serial("renders TODO component if component mapping is missing", (t) => {
	const consoleWarnStub = sinon.stub(console, "warn");

	const Foo = createWrapperComponent("Foo", getSliceComponentProps());

	const wrapper = mount(SliceZone, {
		propsData: {
			slices: [{ slice_type: "foo" }, { slice_type: "bar" }],
			components: defineSliceZoneComponents({
				foo: Foo,
			}),
		},
	});

	t.is(
		wrapper.html(),
		`<div>
  <div class="wrapperComponentFoo"></div>
  <section data-slice-zone-todo-component="" data-slice-type="bar">Could not find a component for Slice type "bar"</section>
</div>`,
	);
	t.is(
		consoleWarnStub.withArgs(sinon.match(/could not find a component/i))
			.callCount,
		1,
	);
	t.is(consoleWarnStub.callCount, 1);

	consoleWarnStub.restore();
});

test("renders provided TODO component if component mapping is missing", (t) => {
	const Foo = createWrapperComponent("Foo", getSliceComponentProps());
	// eslint-disable-next-line no-unused-vars
	const Bar = createWrapperComponent("Bar", getSliceComponentProps());
	const Baz = createWrapperComponent("Baz", getSliceComponentProps());

	const wrapper = mount(SliceZone, {
		propsData: {
			slices: [{ slice_type: "foo" }, { slice_type: "bar" }],
			components: defineSliceZoneComponents({
				foo: Foo,
			}),
			defaultComponent: Baz,
		},
	});

	t.is(
		wrapper.html(),
		`<div>
  <div class="wrapperComponentFoo"></div>
  <div class="wrapperComponentBaz"></div>
</div>`,
	);
});

test.skip("doesn't render TODO component in production", () => {
	// ts-eager does not allow esbuild configuration.
	// We cannot override the `process.env.NODE_ENV` inline replacement.
	// As a result, we cannot test for production currently.
});

test("wraps output with provided wrapper tag", (t) => {
	const Foo = createWrapperComponent("Foo", getSliceComponentProps());
	const Bar = createWrapperComponent("Bar", getSliceComponentProps());

	const wrapper = mount(SliceZone, {
		propsData: {
			slices: [{ slice_type: "foo" }, { slice_type: "bar" }],
			components: defineSliceZoneComponents({
				foo: Foo,
				bar: Bar,
			}),
			wrapper: "main",
		},
	});

	t.is(
		wrapper.html(),
		`<main>
  <div class="wrapperComponentFoo"></div>
  <div class="wrapperComponentBar"></div>
</main>`,
	);
});

test("wraps output with provided wrapper component", async (t) => {
	const Foo = createWrapperComponent("Foo", getSliceComponentProps());
	const Bar = createWrapperComponent("Bar", getSliceComponentProps());

	const wrapper = mount(SliceZone, {
		propsData: {
			slices: [{ slice_type: "foo" }, { slice_type: "bar" }],
			components: defineSliceZoneComponents({
				foo: Foo,
				bar: Bar,
			}),
			wrapper: WrapperComponent,
		},
	});

	await sleep();

	t.is(
		wrapper.html(),
		`<div class="wrapperComponent">
  <div class="wrapperComponentFoo"></div>
  <div class="wrapperComponentBar"></div>
</div>`,
	);
});

test.serial("renders nothing when invalid", (t) => {
	const consoleErrorStub = sinon.stub(console, "error");

	const wrapper = mount(SliceZone, {
		propsData: {
			slices: null,
			components: defineSliceZoneComponents({}),
		},
	});

	t.is(wrapper.html(), "");
	t.is(
		consoleErrorStub.withArgs(
			sinon.match(/Invalid prop: type check failed for prop/i),
		).callCount,
		1,
	);
	t.is(consoleErrorStub.callCount, 1);

	consoleErrorStub.restore();
});

test("reacts to changes properly", async (t) => {
	const Foo = createWrapperComponent("Foo", getSliceComponentProps());
	const Bar = createWrapperComponent("Bar", getSliceComponentProps());

	const localVue = createLocalVue();
	const SliceZoneProxy = localVue.component("SliceZoneProxy", {
		name: "SliceZoneProxy",
		props: {
			slices: {
				type: Array,
				required: true,
			},
			components: {
				type: Object,
				required: true,
			},
		},
		render(h) {
			return h(SliceZoneImpl, {
				props: {
					slices: this.slices,
					components: this.components,
				},
			});
		},
	});

	const wrapper = mount(SliceZoneProxy, {
		propsData: {
			slices: [{ slice_type: "foo" }, { slice_type: "bar" }],
			components: defineSliceZoneComponents({
				foo: Foo,
				bar: Bar,
			}),
		},
		localVue,
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

	t.not(secondRender, firstRender);
	t.is(
		secondRender,
		`<div>
  <div class="wrapperComponentBar"></div>
</div>`,
	);
});
