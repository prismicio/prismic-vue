# HTML serialization is deprecated with `<PrismicRichText>`

As of [`@prismicio/vue`][prismic-vue] v5, `<PrismicRichText>` introduces a new components-based serializer, replacing the previous HTML-based serialization method. This change improves flexibility and security by eliminating the need for the `v-html` directive.

The HTML-based serializer is still accessible to ease your upgrade path to `@prismicio/vue` v5 but **will be removed in a future major version**. We encourage you to migrate to the new components-based serializer to ensure future compatibility.

## Migration example

Here’s how to transition from the old HTML-based serializer to the new components-based serializer:

### Deprecated method (HTML-based Serializer)

```html
<PrismicRichText
	:field="doc.data.imageField"
	:serializer="{
		heading1: ({ children }) => `<h2>${children}</h2>`
	}"
/>
```

### New method (Components-based Serializer)

```html
<PrismicRichText
	:field="doc.data.imageField"
	:components="{
		// Use a `Heading2` component to render `heading1` rich text nodes
		heading1: Heading2
	}"
/>
```

The above snippet relies on an `Heading2.vue` component. Here's an example of this component:

```html
<script setup>
import { getRichTextComponentProps } from "@prismicio/vue"

defineProps(getRichTextComponentProps())
</script>

<template>
	<h2><slot /></h2>
</template>
```

Learn more about the new component serializer on the [`@prismicio/vue` technical reference][prismic-vue-rich-text].

[prismic-vue]: https://prismic.io/docs/technical-reference/prismicio-vue
[prismic-vue-rich-text]: https://prismic.io/docs/technical-reference/prismicio-vue#prismicrichtext
