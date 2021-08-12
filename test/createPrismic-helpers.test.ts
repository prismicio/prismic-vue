import test from "ava";
import * as sinon from "sinon";
import { mount } from "@vue/test-utils";
import * as mock from "@prismicio/mock";

import { WrapperComponent } from "./__fixtures__/WrapperComponent";

import { createPrismic } from "../src";
import { richTextFixture } from "./__fixtures__/richText";
import { LinkType } from "@prismicio/types";

test("`asHTML` uses provided default link resolver", (t) => {
	const spiedLinkResolver = sinon.spy();

	const prismic = createPrismic({
		endpoint: "test",
		linkResolver: spiedLinkResolver,
	});

	const wrapper = mount(WrapperComponent, {
		global: {
			plugins: [prismic],
		},
	});

	wrapper.vm.$prismic.asHTML(richTextFixture.en);

	t.true(spiedLinkResolver.called);
});

test("`asHTML` uses provided link resolver over default provided", (t) => {
	const spiedLinkResolver1 = sinon.spy();
	const spiedLinkResolver2 = sinon.spy();

	const prismic = createPrismic({
		endpoint: "test",
		linkResolver: spiedLinkResolver1,
	});

	const wrapper = mount(WrapperComponent, {
		global: {
			plugins: [prismic],
		},
	});

	wrapper.vm.$prismic.asHTML(richTextFixture.en, spiedLinkResolver2);

	t.false(spiedLinkResolver1.called);
	t.true(spiedLinkResolver2.called);
});

test("`asHTML` uses provided default HTML serializer", (t) => {
	const spiedHTMLSerializer = sinon.spy();

	const prismic = createPrismic({
		endpoint: "test",
		htmlSerializer: spiedHTMLSerializer,
	});

	const wrapper = mount(WrapperComponent, {
		global: {
			plugins: [prismic],
		},
	});

	wrapper.vm.$prismic.asHTML(richTextFixture.en);

	t.true(spiedHTMLSerializer.called);
});

test("`asHTML` uses provided HTML serializer over default provided", (t) => {
	const spiedHTMLSerializer1 = sinon.spy();
	const spiedHTMLSerializer2 = sinon.spy();

	const prismic = createPrismic({
		endpoint: "test",
		htmlSerializer: spiedHTMLSerializer1,
	});

	const wrapper = mount(WrapperComponent, {
		global: {
			plugins: [prismic],
		},
	});

	wrapper.vm.$prismic.asHTML(richTextFixture.en, null, spiedHTMLSerializer2);

	t.false(spiedHTMLSerializer1.called);
	t.true(spiedHTMLSerializer2.called);
});

test("`asLink` uses provided default link resolver", (t) => {
	const spiedLinkResolver = sinon.spy();

	const prismic = createPrismic({
		endpoint: "test",
		linkResolver: spiedLinkResolver,
	});

	const wrapper = mount(WrapperComponent, {
		global: {
			plugins: [prismic],
		},
	});

	wrapper.vm.$prismic.asLink({
		...mock.value.link({ type: LinkType.Document }),
		url: undefined,
	});

	t.is(spiedLinkResolver.callCount, 1);
});

test("`asLink` uses provided link resolver over default provided", (t) => {
	const spiedLinkResolver1 = sinon.spy();
	const spiedLinkResolver2 = sinon.spy();

	const prismic = createPrismic({
		endpoint: "test",
		linkResolver: spiedLinkResolver1,
	});

	const wrapper = mount(WrapperComponent, {
		global: {
			plugins: [prismic],
		},
	});

	wrapper.vm.$prismic.asLink(
		{ ...mock.value.link({ type: LinkType.Document }), url: undefined },
		spiedLinkResolver2,
	);

	t.false(spiedLinkResolver1.called);
	t.is(spiedLinkResolver2.callCount, 1);
});

test("`documentAsLink` uses provided default link resolver", (t) => {
	const spiedLinkResolver = sinon.spy();

	const prismic = createPrismic({
		endpoint: "test",
		linkResolver: spiedLinkResolver,
	});

	const wrapper = mount(WrapperComponent, {
		global: {
			plugins: [prismic],
		},
	});

	wrapper.vm.$prismic.documentAsLink({
		...mock.value.document(),
		url: null,
	});

	t.is(spiedLinkResolver.callCount, 1);
});

test("`documentAsLink` uses provided link resolver over default provided", (t) => {
	const spiedLinkResolver1 = sinon.spy();
	const spiedLinkResolver2 = sinon.spy();

	const prismic = createPrismic({
		endpoint: "test",
		linkResolver: spiedLinkResolver1,
	});

	const wrapper = mount(WrapperComponent, {
		global: {
			plugins: [prismic],
		},
	});

	wrapper.vm.$prismic.documentAsLink(
		{
			...mock.value.document(),
			url: null,
		},
		spiedLinkResolver2,
	);

	t.false(spiedLinkResolver1.called);
	t.is(spiedLinkResolver2.callCount, 1);
});
