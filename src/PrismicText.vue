<script lang="ts" setup>
import type { RichTextField } from "@prismicio/client"
import { asText, isFilled } from "@prismicio/client"
import { watchEffect } from "vue"

import Wrapper from "./lib/Wrapper.vue"
import { devMsg } from "./lib/devMsg"

import type { ComponentOrTagName } from "./types"

/**
 * Props for `<PrismicText />`.
 */
export type PrismicTextProps = {
	/**
	 * The Prismic Rich Text field to render.
	 */
	field: RichTextField | null | undefined

	/**
	 * The string value to be rendered when the field is empty. If a fallback is
	 * not given, `""` (nothing) will be rendered.
	 */
	fallback?: string

	/**
	 * The separator used between blocks.
	 *
	 * @defaultValue `" "` (a whitespace)
	 */
	separator?: string

	/**
	 * An HTML tag name or a component used to wrap the output. `<PrismicText />`
	 * is not wrapped by default.
	 *
	 * @defaultValue `"template"` (no wrapper)
	 */
	wrapper?: ComponentOrTagName
}

const props = defineProps<PrismicTextProps>()
defineOptions({ name: "PrismicText" })

if (typeof process !== "undefined" && process.env.NODE_ENV === "development") {
	watchEffect(() => {
		if (typeof props.field === "string") {
			throw new Error(
				`[PrismicText] The "field" prop only accepts a Rich Text or Title field's value but was provided a different type of field instead (e.g. a Key Text or Select field). You can resolve this error by rendering the field value inline without <PrismicText>. For more details, see ${devMsg(
					"prismictext-works-only-with-rich-text-and-title-fields",
				)}`,
			)
		}
	}, {})
}
</script>

<template>
	<Wrapper v-if="isFilled.richText(field) || fallback" :wrapper="wrapper">
		{{ asText(field) || fallback }}
	</Wrapper>
</template>
