import { expect, it } from "vitest"

import type { EmbedField } from "@prismicio/client"
import { mount } from "@vue/test-utils"
import { markRaw } from "vue"

import { WrapperComponent } from "./__fixtures__/WrapperComponent"

import { PrismicEmbed } from "../src/components"

it("renders nothing when passed an empty field", () => {
	const wrapper = mount(PrismicEmbed, {
		props: { field: {} },
	})

	expect(wrapper.html()).toBe("<!--v-if-->")
})

it("renders embed field", (ctx) => {
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

it("renders embed field with no HTML", (ctx) => {
	const wrapper = mount(PrismicEmbed, {
		props: {
			field: {
				...ctx.mock.value.embed(),
				html: null,
			} as EmbedField,
		},
	})

	expect(wrapper.html()).toMatchInlineSnapshot(
		`"<div data-oembed="https://twitter.com/prismicio/status/1354112310252630016" data-oembed-type="rich"></div>"`,
	)
})

it("uses provided wrapper tag", (ctx) => {
	const wrapper = mount(PrismicEmbed, {
		props: { field: ctx.mock.value.embed(), wrapper: "section" },
	})

	expect(wrapper.html()).toMatchInlineSnapshot(
		`
		"<section data-oembed="https://twitter.com/timbenniks/status/1304146886832594944" data-oembed-type="rich">
		  <blockquote class="twitter-tweet">
		    <p lang="en" dir="ltr">I’ve been diving deep on <a href="https://twitter.com/prismicio?ref_src=twsrc%5Etfw">@prismicio</a> <a href="https://twitter.com/hashtag/slicemachine?src=hash&amp;ref_src=twsrc%5Etfw">#slicemachine</a> today. I made all my own components and I used custom slices. It works like a charm with <a href="https://twitter.com/nuxt_js?ref_src=twsrc%5Etfw">@nuxt_js</a>. Also: I’m coding with this view. <a href="https://t.co/F0I8X9gz39">pic.twitter.com/F0I8X9gz39</a></p>— Tim Benniks (@timbenniks) <a href="https://twitter.com/timbenniks/status/1304146886832594944?ref_src=twsrc%5Etfw">September 10, 2020</a>
		  </blockquote>
		  <script async="" src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
		</section>"
	`,
	)
})

it("uses provided wrapper component", (ctx) => {
	const wrapper = mount(PrismicEmbed, {
		props: {
			field: ctx.mock.value.embed(),
			wrapper: markRaw(WrapperComponent),
		},
	})

	expect(wrapper.html()).toMatchInlineSnapshot(
		`"<div class="wrapperComponent" data-oembed="https://www.youtube.com/embed/fiOwHYFkUz0" data-oembed-type="video"><iframe width="200" height="113" src="https://www.youtube.com/embed/fiOwHYFkUz0?feature=oembed" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe></div>"`,
	)
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
