import test from "ava";
import * as sinon from "sinon";
import { mount, createLocalVue } from "@vue/test-utils";
import * as mock from "@prismicio/mock";

import { LinkType } from "@prismicio/types";
import Vue from "vue";
import VueRouter from "vue-router";

import router from "./__fixtures__/router";

import PrismicLinkImpl from "../src/components/Link";
import PrismicVue from "../src";

const PrismicLink = Vue.component(
	"PrismicLink",
	PrismicLinkImpl({ component: "router-link" }),
);

test("renders empty link field", (t) => {
	const wrapper = mount(PrismicLink, {
		propsData: {
			field: mock.value.link({ seed: 1, isFilled: false, type: LinkType.Any }),
		},
		context: { children: ["foo"] },
	});

	t.is(wrapper.html(), '<a href="">foo</a>');
});

test("renders link to web field", (t) => {
	const wrapper = mount(PrismicLink, {
		propsData: {
			field: {
				...mock.value.link({
					seed: 2,
					type: LinkType.Web,
					withTargetBlank: false,
				}),
				url: "https://example.com",
			},
		},
		context: { children: ["foo"] },
	});

	t.is(wrapper.html(), '<a href="https://example.com">foo</a>');
});

test("renders link to media field", (t) => {
	const wrapper = mount(PrismicLink, {
		propsData: {
			field: {
				...mock.value.link({ seed: 3, type: LinkType.Media }),
				url: "https://example.com/image.png",
			},
		},
		context: { children: ["foo"] },
	});

	t.is(wrapper.html(), '<a href="https://example.com/image.png">foo</a>');
});

test("renders link to document field", (t) => {
	const localVue = createLocalVue();
	localVue.use(VueRouter);

	const wrapper = mount(PrismicLink, {
		propsData: {
			field: {
				...mock.value.link({ seed: 4, type: LinkType.Document }),
				url: "/bar",
			},
		},
		context: { children: ["foo"] },
		localVue,
		router,
	});

	t.is(wrapper.html(), '<a href="/bar" class="">foo</a>');
});

test("uses plugin provided link resolver", (t) => {
	const localVue = createLocalVue();
	localVue.use(VueRouter);

	const spiedLinkResolver = sinon.spy(() => "/bar");

	localVue.use(PrismicVue, {
		endpoint: "test",
		linkResolver: spiedLinkResolver,
	});

	const wrapper = mount(PrismicLink, {
		propsData: {
			field: {
				...mock.value.link({ seed: 5, type: LinkType.Document }),
				url: undefined,
			},
		},
		context: { children: ["foo"] },
		localVue,
		router,
	});

	t.is(spiedLinkResolver.callCount, 1);
	t.is(wrapper.html(), '<a href="/bar" class="">foo</a>');
});

test("uses provided link resolver over plugin provided", (t) => {
	const localVue = createLocalVue();
	localVue.use(VueRouter);

	const spiedLinkResolver1 = sinon.spy(() => "/bar");
	const spiedLinkResolver2 = sinon.spy(() => "/baz");

	localVue.use(PrismicVue, {
		endpoint: "test",
		linkResolver: spiedLinkResolver1,
	});

	const wrapper = mount(PrismicLink, {
		propsData: {
			field: {
				...mock.value.link({ seed: 6, type: LinkType.Document }),
				url: undefined,
			},
			linkResolver: spiedLinkResolver2,
		},
		context: { children: ["foo"] },
		localVue,
		router,
	});

	t.false(spiedLinkResolver1.called);
	t.is(spiedLinkResolver2.callCount, 1);
	t.is(wrapper.html(), '<a href="/baz" class="">foo</a>');
});

test("renders link with blank target", (t) => {
	const wrapper = mount(PrismicLink, {
		propsData: {
			field: {
				...mock.value.link({
					seed: 7,
					type: LinkType.Web,
					withTargetBlank: true,
				}),
				url: "https://example.com",
			},
		},
		context: { children: ["foo"] },
	});

	t.is(
		wrapper.html(),
		'<a href="https://example.com" target="_blank" rel="noopener noreferrer">foo</a>',
	);
});

test("renders link with blank target using provided default rel", (t) => {
	const wrapper = mount(PrismicLink, {
		propsData: {
			field: {
				...mock.value.link({
					seed: 9,
					type: LinkType.Web,
					withTargetBlank: true,
				}),
				url: "https://example.com",
			},
			blankTargetRelAttribute: "baz",
		},
		context: { children: ["foo"] },
	});

	t.is(
		wrapper.html(),
		'<a href="https://example.com" target="_blank" rel="baz">foo</a>',
	);
});

test("uses provided blank and rel attribute", (t) => {
	const wrapper = mount(PrismicLink, {
		propsData: {
			field: {
				...mock.value.link({ seed: 10, type: LinkType.Web }),
				url: "https://example.com",
			},
			target: "bar",
			rel: "baz",
		},
		context: { children: ["foo"] },
	});

	t.is(
		wrapper.html(),
		'<a href="https://example.com" target="bar" rel="baz">foo</a>',
	);
});

test("renders nothing when invalid", (t) => {
	const consoleErrorStub = sinon.stub(console, "error");

	const wrapper = mount(PrismicLink, {
		propsData: { field: null },
		context: { children: ["foo"] },
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
	const localVue = createLocalVue();
	const PrismicLinkProxy = localVue.component("PrismicLinkProxy", {
		name: "PrismicLinkProxy",
		props: {
			field: {
				type: Object,
				required: true,
			},
		},
		render(h) {
			return h(
				PrismicLinkImpl({ component: "router-link" }),
				{
					props: {
						field: this.field,
					},
				},
				this.$slots.default,
			);
		},
	});

	const wrapper = mount(PrismicLinkProxy, {
		propsData: {
			field: {
				...mock.value.link({ seed: 15, type: LinkType.Web }),
				url: "https://example.com",
			},
		},
		slots: { default: "foo" },
	});

	const firstRender = wrapper.html();

	await wrapper.setProps({
		field: {
			...mock.value.link({
				seed: 16,
				type: LinkType.Web,
				withTargetBlank: false,
			}),
			target: null,
			url: "https://prismic.io",
		},
	});

	const secondRender = wrapper.html();

	t.not(secondRender, firstRender);
	t.is(secondRender, '<a href="https://prismic.io">foo</a>');
});
