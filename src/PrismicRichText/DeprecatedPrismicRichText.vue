<script lang="ts" setup>
// TODO: Remove in v6
import { asHTML, isFilled } from "@prismicio/client"
import { DEV } from "esm-env"
import type { Component } from "vue"
import {
	computed,
	inject,
	nextTick,
	onBeforeUnmount,
	onMounted,
	ref,
	watch,
} from "vue"
import { routerKey } from "vue-router"

import { devMsg } from "../lib/devMsg"
import { isInternalURL } from "../lib/isInternalURL"

import { usePrismic } from "../usePrismic"

import type { PrismicRichTextProps } from "./PrismicRichText.vue"

/**
 * The default component rendered to wrap the HTML output.
 */
const defaultWrapper = "div"

const props = defineProps<
	Pick<
		PrismicRichTextProps,
		"field" | "linkResolver" | "serializer" | "wrapper"
	> & { fallback?: string }
>()
defineOptions({ name: "DeprecatedPrismicRichText" })

const { options } = usePrismic()

if (DEV) {
	onMounted(() => {
		console.warn(
			`[PrismicRichText] You're using the deprecated version of \`<PrismicRichText>\` because either the \`serializer\` prop or the plugin \`richTextSerializer\` option were provided. This API will be removed in a future major. For more details, see ${devMsg(
				"html-serialization-is-deprecated-with-prismic-rich-text",
			)}`,
		)
	})
}

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

onMounted(() => {
	removeListeners()
	nextTick(addListeners)
})

watch(html, () => {
	removeListeners()
	nextTick(addListeners)
})

onBeforeUnmount(() => {
	removeListeners()
})
</script>

<template>
	<component
		v-if="isFilled.richText(field) || fallback"
		ref="root"
		:is="wrapper || defaultWrapper"
		v-html="html"
	/>
</template>
