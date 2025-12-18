<script lang="ts" setup>
import type { RichTextField } from "@prismicio/client"
import { asText } from "@prismicio/client"
import { DEV } from "esm-env"
import { watchEffect } from "vue"

import { devMsg } from "./lib/devMsg"

/**
 * Props for `<PrismicText />`.
 */
export type PrismicTextProps = {
	/**
	 * The Prismic rich text field to render.
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
}

const props = defineProps<PrismicTextProps>()
defineOptions({ name: "PrismicText" })

if (DEV) {
	watchEffect(() => {
		if (typeof props.field === "string") {
			throw new Error(
				`[PrismicText] The "field" prop only accepts a Rich Text or title field's value but was provided a different type of field instead (e.g. a Key Text or Select field). You can resolve this error by rendering the field value inline without <PrismicText>. For more details, see ${devMsg(
					"prismictext-works-only-with-rich-text-and-title-fields",
				)}`,
			)
		}
	}, {})
}
</script>

<template>
	{{ asText(field) || fallback || "" }}
</template>
