<script lang="ts" setup>
import {
	type HTMLRichTextFunctionSerializer,
	type HTMLRichTextMapSerializer,
	type LinkResolverFunction,
	type RichTextField,
	asHTML,
	isFilled,
} from "@prismicio/client"
import type { Component } from "vue"
import { computed, inject, nextTick, onBeforeUnmount, ref, watch } from "vue"
import { routerKey } from "vue-router"

import Wrapper from "../lib/Wrapper.vue"
import { isInternalURL } from "../lib/isInternalURL"

import type { ComponentOrTagName } from "../types"

import { usePrismic } from "../usePrismic"

/**
 * The default component rendered to wrap the HTML output.
 */
const defaultWrapper = "div"

/**
 * Props for `<PrismicRichText />`.
 */
export type PrismicRichTextProps = {
	/**
	 * The Prismic rich text or title field to render.
	 */
	field: RichTextField | null | undefined

	/**
	 * The string value to be rendered when the field is empty. If a fallback is
	 * not given, `""` (nothing) will be rendered.
	 */
	fallback?: string

	/**
	 * A link resolver function used to resolve link when not using the route
	 * resolver parameter with `@prismicio/client`.
	 *
	 * @defaultValue The link resolver provided to `@prismicio/vue` plugin if configured.
	 *
	 * @see Link resolver documentation {@link https://prismic.io/docs/core-concepts/link-resolver-route-resolver#link-resolver}
	 */
	linkResolver?: LinkResolverFunction

	/**
	 * An HTML serializer to customize the way rich text fields are rendered.
	 *
	 * @deprecated Use `components` instead.
	 *
	 * @defaultValue The HTML serializer provided to `@prismicio/vue` plugin if configured.
	 *
	 * @see HTML serializer documentation {@link https://prismic.io/docs/core-concepts/html-serializer}
	 */
	// TODO: Remove in v6
	serializer?: HTMLRichTextFunctionSerializer | HTMLRichTextMapSerializer

	/**
	 * An HTML tag name or a component used to wrap the output. `<PrismicText />`
	 * is not wrapped by default.
	 *
	 * @defaultValue `"template"` (no wrapper)
	 */
	wrapper?: ComponentOrTagName
}

const props = defineProps<PrismicRichTextProps>()
defineOptions({ name: "PrismicRichText" })

const { options } = usePrismic()

const html = computed(() => {
	if (!isFilled.richText(props.field)) {
		return props.fallback ?? ""
	}

	const linkResolver = props.linkResolver ?? options.linkResolver
	const serializer = props.serializer ?? options.richTextSerializer

	return asHTML(props.field, { linkResolver, serializer })
})

// Internal links handling
const root = ref<HTMLElement | Comment | Component | null>(null)

const maybeRouter = inject(routerKey, null)

type InternalLink = {
	element: HTMLAnchorElement
	listener: EventListener
}

let links: InternalLink[] = []

const navigate: EventListener = function (
	this: { href: string },
	event: Event,
) {
	event.preventDefault()
	maybeRouter?.push(this.href)
}

const addListeners = () => {
	const node: HTMLElement | Comment | null =
		root.value && "$el" in root.value ? root.value.$el : root.value
	if (node && "querySelectorAll" in node) {
		// Get all internal link tags and add listeners on them
		links = Array.from(node.querySelectorAll("a"))
			.map((element) => {
				const href = element.getAttribute("href")

				if (href && isInternalURL(href)) {
					const listener = navigate.bind({ href })
					element.addEventListener("click", listener)

					return { element, listener }
				} else {
					return false
				}
			})
			.filter((link): link is InternalLink => link as boolean)
	}
}

const removeListeners = () => {
	links.forEach(({ element, listener }) =>
		element.removeEventListener("click", listener),
	)
	links = []
}

watch(
	html,
	() => {
		removeListeners()
		nextTick(addListeners)
	},
	{ immediate: true },
)

onBeforeUnmount(() => {
	removeListeners()
})
</script>

<template>
	<Wrapper
		v-if="isFilled.richText(field) || fallback"
		ref="root"
		:wrapper="wrapper || defaultWrapper"
		v-html="html"
	/>
</template>
