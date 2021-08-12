import test from "ava";
import * as sinon from "sinon";
import { mount } from "@vue/test-utils";

import { markRaw } from "vue";

import { createWrapperComponent } from "./__fixtures__/WrapperComponent";

import { SliceZoneImpl } from "../src/components";
import {
	getSliceComponentProps,
	SliceLike,
	SliceZoneLike,
	createPrismic,
} from "../src";
import { WrapperComponent } from "../playground/src/components/WrapperComponent";

test("renders slice zone with correct component mapping", (t) => {
	const Foo = createWrapperComponent("Foo", getSliceComponentProps());
	const Bar = createWrapperComponent("Bar", getSliceComponentProps());

	const wrapper = mount(SliceZoneImpl, {
		props: {
			slices: [{ slice_type: "foo" }, { slice_type: "bar" }],
			components: {
				foo: markRaw(Foo),
				bar: markRaw(Bar),
			},
		},
	});

	t.is(
		wrapper.html(),
		`<div class="wrapperComponentFoo"></div>
<div class="wrapperComponentBar"></div>`,
	);
});

test("provides context to each slice", (t) => {
	const Foo = createWrapperComponent("Foo", getSliceComponentProps());
	const Bar = createWrapperComponent("Bar", getSliceComponentProps());

	const context = { foo: "bar" };

	const wrapper = mount(SliceZoneImpl, {
		props: {
			slices: [{ slice_type: "foo" }, { slice_type: "bar" }],
			components: {
				foo: markRaw(Foo),
				bar: markRaw(Bar),
			},
			context,
		},
	});

	t.deepEqual(wrapper.getComponent(Foo).props().context, context);
	t.deepEqual(wrapper.getComponent(Bar).props().context, context);
});

test("renders TODO component if component mapping is missing", (t) => {
	const consoleWarnStub = sinon.stub(console, "warn");

	const Foo = createWrapperComponent("Foo", getSliceComponentProps());

	const wrapper = mount(SliceZoneImpl, {
		props: {
			slices: [{ slice_type: "foo" }, { slice_type: "bar" }],
			components: {
				foo: markRaw(Foo),
			},
		},
	});

	t.is(
		wrapper.html(),
		`<div class="wrapperComponentFoo"></div>
<section data-slice-zone-todo-component="" data-slice-type="bar">Could not find a component for Slice type "bar"</section>`,
	);
	t.is(
		consoleWarnStub.withArgs(sinon.match(/could not find a component/i))
			.callCount,
		1,
	);
	t.is(consoleWarnStub.callCount, 1);

	consoleWarnStub.restore();
});

test("renders plugin provided TODO component if component mapping is missing", (t) => {
	const Foo = createWrapperComponent("Foo", getSliceComponentProps());
	const Bar = createWrapperComponent("Bar", getSliceComponentProps());

	const prismic = createPrismic({
		endpoint: "test",
		components: { sliceZoneDefaultComponent: Bar },
	});

	const wrapper = mount(SliceZoneImpl, {
		props: {
			slices: [{ slice_type: "foo" }, { slice_type: "bar" }],
			components: {
				foo: markRaw(Foo),
			},
		},
		global: {
			plugins: [prismic],
		},
	});

	t.is(
		wrapper.html(),
		`<div class="wrapperComponentFoo"></div>
<div class="wrapperComponentBar"></div>`,
	);
});

test("renders provided TODO component over plugin provided if component mapping is missing", (t) => {
	const Foo = createWrapperComponent("Foo", getSliceComponentProps());
	const Bar = createWrapperComponent("Bar", getSliceComponentProps());
	const Baz = createWrapperComponent("Baz", getSliceComponentProps());

	const prismic = createPrismic({
		endpoint: "test",
		components: { sliceZoneDefaultComponent: Bar },
	});

	const wrapper = mount(SliceZoneImpl, {
		props: {
			slices: [{ slice_type: "foo" }, { slice_type: "bar" }],
			components: {
				foo: markRaw(Foo),
			},
			defaultComponent: markRaw(Baz),
		},
		global: {
			plugins: [prismic],
		},
	});

	t.is(
		wrapper.html(),
		`<div class="wrapperComponentFoo"></div>
<div class="wrapperComponentBaz"></div>`,
	);
});

test("wraps output with provided wrapper tag", (t) => {
	const Foo = createWrapperComponent("Foo", getSliceComponentProps());
	const Bar = createWrapperComponent("Bar", getSliceComponentProps());

	const wrapper = mount(SliceZoneImpl, {
		props: {
			slices: [{ slice_type: "foo" }, { slice_type: "bar" }],
			components: {
				foo: markRaw(Foo),
				bar: markRaw(Bar),
			},
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

test("wraps output with provided wrapper component", (t) => {
	const Foo = createWrapperComponent("Foo", getSliceComponentProps());
	const Bar = createWrapperComponent("Bar", getSliceComponentProps());

	const wrapper = mount(SliceZoneImpl, {
		props: {
			slices: [{ slice_type: "foo" }, { slice_type: "bar" }],
			components: {
				foo: markRaw(Foo),
				bar: markRaw(Bar),
			},
			wrapper: markRaw(WrapperComponent),
		},
	});

	t.is(
		wrapper.html(),
		`<div class="wrapperComponent">
  <div class="wrapperComponentFoo"></div>
  <div class="wrapperComponentBar"></div>
</div>`,
	);
});

test("renders nothing when invalid", (t) => {
	const consoleWarnStub = sinon.stub(console, "warn");

	const wrapper = mount(SliceZoneImpl, {
		props: {
			slices: null as unknown as SliceZoneLike<SliceLike>,
			components: {},
		},
	});

	t.is(wrapper.html(), "<!---->");
	t.is(
		consoleWarnStub.withArgs(
			sinon.match(/Invalid prop: type check failed for prop/i),
		).callCount,
		1,
	);
	t.is(consoleWarnStub.callCount, 1);

	consoleWarnStub.restore();
});

test("reacts to changes properly", async (t) => {
	const Foo = createWrapperComponent("Foo", getSliceComponentProps());
	const Bar = createWrapperComponent("Bar", getSliceComponentProps());

	const wrapper = mount(SliceZoneImpl, {
		props: {
			slices: [{ slice_type: "foo" }, { slice_type: "bar" }],
			components: {
				foo: markRaw(Foo),
				bar: markRaw(Bar),
			},
		},
	});

	const firstRender = wrapper.html();

	await wrapper.setProps({
		slices: [{ slice_type: "bar" }],
		components: {
			foo: markRaw(Foo),
			bar: markRaw(Bar),
		},
	});

	const secondRender = wrapper.html();

	t.not(secondRender, firstRender);
	t.is(secondRender, `<div class="wrapperComponentBar"></div>`);
});
