import { describe, expect, it } from "vitest"

import type { EmbedField } from "@prismicio/client"
import { mount } from "@vue/test-utils"
import { markRaw } from "vue"

import { WrapperComponent } from "./__fixtures__/WrapperComponent"

import { PrismicEmbed } from "../src/components"

describe("renders an embed field", () => {
	it("empty", () => {
		const wrapper = mount(PrismicEmbed, {
			props: { field: {} },
		})

		expect(wrapper.html()).toBe("<!--v-if-->")
	})

	it("basic", (ctx) => {
		const wrapper = mount(PrismicEmbed, {
			props: { field: ctx.mock.value.embed() },
		})

		expect(wrapper.html()).toMatchInlineSnapshot(
			`
		"<div data-oembed="https://twitter.com/prismicio/status/1356293316158095361" data-oembed-type="rich">
		  <blockquote class="twitter-tweet">
		    <p lang="en" dir="ltr">Gatsby is a popular choice for Prismic users and we work hard on delivering a CMS that plays to its strengths.<br><br>But, what makes <a href="https://twitter.com/GatsbyJS?ref_src=twsrc%5Etfw">@GatsbyJS</a> so popular?<br><br>Here are some of <a href="https://twitter.com/mxstbr?ref_src=twsrc%5Etfw">@mxstbr</a>'s thoughts on Gatsby's success and how they're improving developer experience.<a href="https://t.co/ZjCPvsWWUD">https://t.co/ZjCPvsWWUD</a> <a href="https://t.co/EQqzJpeNKl">pic.twitter.com/EQqzJpeNKl</a></p>— Prismic (@prismicio) <a href="https://twitter.com/prismicio/status/1356293316158095361?ref_src=twsrc%5Etfw">February 1, 2021</a>
		  </blockquote>
		  <script async="" src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
		</div>"
	`,
		)
	})

	it("without HTML", (ctx) => {
		const wrapper = mount(PrismicEmbed, {
			props: {
				field: {
					...ctx.mock.value.embed(),
					html: null,
				} as EmbedField,
			},
		})

		expect(wrapper.html()).toMatchInlineSnapshot(
			`"<div data-oembed="https://www.youtube.com/embed/fiOwHYFkUz0" data-oembed-type="video"></div>"`,
		)
	})
})

describe("renders with wrapper", () => {
	it("tag", (ctx) => {
		const wrapper = mount(PrismicEmbed, {
			props: { field: ctx.mock.value.embed(), wrapper: "section" },
		})

		expect(wrapper.html()).toMatchInlineSnapshot(
			`
			"<section data-oembed="https://twitter.com/prismicio/status/1356293316158095361" data-oembed-type="rich">
			  <blockquote class="twitter-tweet">
			    <p lang="en" dir="ltr">Gatsby is a popular choice for Prismic users and we work hard on delivering a CMS that plays to its strengths.<br><br>But, what makes <a href="https://twitter.com/GatsbyJS?ref_src=twsrc%5Etfw">@GatsbyJS</a> so popular?<br><br>Here are some of <a href="https://twitter.com/mxstbr?ref_src=twsrc%5Etfw">@mxstbr</a>'s thoughts on Gatsby's success and how they're improving developer experience.<a href="https://t.co/ZjCPvsWWUD">https://t.co/ZjCPvsWWUD</a> <a href="https://t.co/EQqzJpeNKl">pic.twitter.com/EQqzJpeNKl</a></p>— Prismic (@prismicio) <a href="https://twitter.com/prismicio/status/1356293316158095361?ref_src=twsrc%5Etfw">February 1, 2021</a>
			  </blockquote>
			  <script async="" src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
			</section>"
		`,
		)
	})

	it("component", (ctx) => {
		const wrapper = mount(PrismicEmbed, {
			props: {
				field: ctx.mock.value.embed(),
				wrapper: markRaw(WrapperComponent),
			},
		})

		expect(wrapper.html()).toMatchInlineSnapshot(
			`
			"<div class="wrapperComponent" data-oembed="https://twitter.com/prismicio/status/1354835716430319617" data-oembed-type="rich">
			  <blockquote class="twitter-tweet">
			    <p lang="en" dir="ltr">Does anyone want to create a wildly popular website for discussing 'Wall Street Bets' using Prismic?<br><br>It may or may not have to look a lot like <a href="https://twitter.com/hashtag/reddit?src=hash&amp;ref_src=twsrc%5Etfw">#reddit</a> and we won't make it private.<br><br>Just asking for some friends...</p>— Prismic (@prismicio) <a href="https://twitter.com/prismicio/status/1354835716430319617?ref_src=twsrc%5Etfw">January 28, 2021</a>
			  </blockquote>
			  <script async="" src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
			</div>"
		`,
		)
	})
})

it("reacts to changes properly", async (ctx) => {
	const wrapper = mount(PrismicEmbed, {
		props: { field: ctx.mock.value.embed() },
	})

	const firstRender = wrapper.html()

	await wrapper.setProps({
		field: {
			...ctx.mock.value.embed(),
			embed_url: "https://www.youtube.com/embed/c-ATzcy6VkI",
		},
	})

	const secondRender = wrapper.html()

	expect(secondRender).not.toBe(firstRender)
	expect(secondRender).toMatchInlineSnapshot(
		`
		"<div data-oembed="https://www.youtube.com/embed/c-ATzcy6VkI" data-oembed-type="rich">
		  <blockquote class="twitter-tweet">
		    <p lang="en" dir="ltr">Gatsby is a popular choice for Prismic users and we work hard on delivering a CMS that plays to its strengths.<br><br>But, what makes <a href="https://twitter.com/GatsbyJS?ref_src=twsrc%5Etfw">@GatsbyJS</a> so popular?<br><br>Here are some of <a href="https://twitter.com/mxstbr?ref_src=twsrc%5Etfw">@mxstbr</a>'s thoughts on Gatsby's success and how they're improving developer experience.<a href="https://t.co/ZjCPvsWWUD">https://t.co/ZjCPvsWWUD</a> <a href="https://t.co/EQqzJpeNKl">pic.twitter.com/EQqzJpeNKl</a></p>— Prismic (@prismicio) <a href="https://twitter.com/prismicio/status/1356293316158095361?ref_src=twsrc%5Etfw">February 1, 2021</a>
		  </blockquote>
		  <script async="" src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
		</div>"
	`,
	)
})
