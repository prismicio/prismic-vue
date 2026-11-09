<script setup lang="ts">
import { type ImageField, isFilled } from "@prismicio/client"
import { PrismicImage, usePrismic } from "@prismicio/vue"
import { ref } from "vue"

const { client } = usePrismic()
const { data: tests } = await client.getSingle("image_test")

if (!isFilled.image(tests.filled)) throw new Error("Expected a filled image field.")
if (isFilled.image(tests.empty)) throw new Error("Expected an empty image field.")

// Props that TypeScript rejects, to check the warnings.
const invalidProps = {
	widthsAndPixelDensities: { widths: "defaults", pixelDensities: "defaults" },
	alt: { alt: "non-decorative" },
	fallbackAlt: { fallbackAlt: "non-decorative" },
} as Record<string, object>

const reactive = ref<ImageField>(tests.filled)
</script>

<template>
	<PrismicImage data-testid="filled" :field="tests.filled" />
	<PrismicImage data-testid="empty" :field="tests.empty" />

	<PrismicImage data-testid="widths" :field="tests.filled" :widths="[100, 200, 300]" />
	<PrismicImage data-testid="default-widths" :field="tests.filled" widths="defaults" />
	<PrismicImage data-testid="thumbnail-widths" :field="tests.with_thumbnails" widths="thumbnails" />
	<PrismicImage data-testid="pixel-densities" :field="tests.filled" :pixel-densities="[1, 2]" />
	<PrismicImage
		data-testid="default-pixel-densities"
		:field="tests.filled"
		pixel-densities="defaults"
	/>
	<PrismicImage
		data-testid="widths-and-pixel-densities"
		:field="tests.filled"
		v-bind="invalidProps.widthsAndPixelDensities"
	/>

	<PrismicImage data-testid="with-alt" :field="tests.with_alt_text" />
	<PrismicImage data-testid="without-alt" :field="tests.without_alt_text" />
	<PrismicImage data-testid="fallback-alt" :field="tests.without_alt_text" fallback-alt="" />
	<PrismicImage data-testid="decorative-alt-with-alt" :field="tests.with_alt_text" alt="" />
	<PrismicImage data-testid="decorative-alt-without-alt" :field="tests.without_alt_text" alt="" />
	<PrismicImage data-testid="invalid-alt" :field="tests.filled" v-bind="invalidProps.alt" />
	<PrismicImage
		data-testid="invalid-fallback-alt"
		:field="tests.filled"
		v-bind="invalidProps.fallbackAlt"
	/>

	<PrismicImage data-testid="number-dimensions" :field="tests.filled" :width="100" :height="100" />
	<PrismicImage data-testid="string-dimensions" :field="tests.filled" width="100" height="100" />
	<PrismicImage data-testid="nan-dimensions" :field="tests.filled" width="foo" height="bar" />
	<PrismicImage data-testid="width-only" :field="tests.filled" :width="100" />
	<PrismicImage data-testid="height-only" :field="tests.filled" :height="100" />

	<PrismicImage data-testid="imgix" :field="tests.filled" :imgix-params="{ sat: -100 }" />
	<PrismicImage
		data-testid="imgix-remove"
		:field="tests.filled"
		:imgix-params="{ auto: undefined }"
	/>

	<button @click="reactive = tests.with_crop">Change image</button>
	<PrismicImage data-testid="reactive" :field="reactive" />
</template>
