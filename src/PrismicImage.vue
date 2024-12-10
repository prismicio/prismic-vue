<script lang="ts" setup>
import type { ImageField, asImageSrc } from "@prismicio/client"
import {
	asImagePixelDensitySrcSet,
	asImageWidthSrcSet,
	isFilled,
} from "@prismicio/client"
import { DEV } from "esm-env"
import { computed, watchEffect } from "vue"

import { devMsg } from "./lib/devMsg"

import { usePrismic } from "./usePrismic"

/**
 * Props for `<PrismicImage />`.
 */
export type PrismicImageProps = {
	/**
	 * The Prismic Image field or thumbnail to render.
	 */
	field: ImageField | ImageField<string>

	/**
	 * An object of Imgix URL API parameters to transform the image.
	 *
	 * See: https://docs.imgix.com/apis/rendering
	 */
	imgixParams?: Parameters<typeof asImageSrc>[1]

	/**
	 * Declare an image as decorative by providing `alt=""`.
	 *
	 * See:
	 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/alt#decorative_images
	 */
	alt?: ""

	/**
	 * Declare an image as decorative only if the Image field does not have
	 * alternative text by providing `fallbackAlt=""`.
	 *
	 * See:
	 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/alt#decorative_images
	 */
	fallbackAlt?: ""
} & (
	| {
			/**
			 * Widths used to build a `srcset` value for the Image field.
			 *
			 * If a `widths` prop is not given or `"defaults"` is passed, the
			 * following widths will be used: 640, 750, 828, 1080, 1200, 1920, 2048,
			 * 3840.
			 *
			 * If the Image field contains responsive views, each responsive view can
			 * be used as a width in the resulting `srcset` by passing `"thumbnails"`
			 * as the `widths` prop.
			 */
			widths?:
				| NonNullable<Parameters<typeof asImageWidthSrcSet>[1]>["widths"]
				| "thumbnails"
				| "defaults"
			/**
			 * Not used when the `widths` prop is used.
			 */
			pixelDensities?: never
	  }
	| {
			/**
			 * Not used when the `widths` prop is used.
			 */
			widths?: never
			/**
			 * Pixel densities used to build a `srcset` value for the Image field.
			 *
			 * If a `pixelDensities` prop is passed `"defaults"`, the following pixel
			 * densities will be used: 1, 2, 3.
			 */
			pixelDensities:
				| NonNullable<
						Parameters<typeof asImagePixelDensitySrcSet>[1]
				  >["pixelDensities"]
				| "defaults"
	  }
)

const props = defineProps<PrismicImageProps>()
defineOptions({ name: "PrismicImage" })

const { options } = usePrismic()

if (DEV) {
	watchEffect(() => {
		if (typeof props.alt === "string" && props.alt !== "") {
			console.warn(
				`[PrismicImage] The "alt" prop can only be used to declare an image as decorative by passing an empty string (alt="") but was provided a non-empty string. You can resolve this warning by removing the "alt" prop or changing it to alt="". For more details, see ${devMsg(
					"alt-must-be-an-empty-string",
				)}`,
			)
		}

		if (typeof props.fallbackAlt === "string" && props.fallbackAlt !== "") {
			console.warn(
				`[PrismicImage] The "fallbackAlt" prop can only be used to declare an image as decorative by passing an empty string (fallbackAlt="") but was provided a non-empty string. You can resolve this warning by removing the "fallbackAlt" prop or changing it to fallbackAlt="". For more details, see ${devMsg(
					"alt-must-be-an-empty-string",
				)}`,
			)
		}

		if (props.widths && props.pixelDensities) {
			console.warn(
				`[PrismicImage] Only one of "widths" or "pixelDensities" props can be provided. You can resolve this warning by removing either the "widths" or "pixelDensities" prop. "widths" will be used in this case.`,
			)
		}
	})
}

const image = computed(() => {
	if (!isFilled.imageThumbnail(props.field)) {
		return
	}

	let src: string | undefined
	let srcSet: string | undefined
	if (props.widths || !props.pixelDensities) {
		const res = asImageWidthSrcSet(props.field, {
			...props.imgixParams,
			widths:
				props.widths === "defaults"
					? options.components?.imageWidthSrcSetDefaults
					: props.widths,
		})

		src = res.src
		srcSet = res.srcset
	} else if (props.pixelDensities) {
		const res = asImagePixelDensitySrcSet(props.field, {
			...props.imgixParams,
			pixelDensities:
				props.pixelDensities === "defaults"
					? options.components?.imagePixelDensitySrcSetDefaults
					: props.pixelDensities,
		})

		src = res.src
		srcSet = res.srcset
	}

	return {
		src,
		srcSet,
		alt: props.alt ?? (props.field.alt || props.fallbackAlt),
	}
})
</script>

<template>
	<img v-if="image" :src="image.src" :srcset="image.srcSet" :alt="image.alt" />
</template>
