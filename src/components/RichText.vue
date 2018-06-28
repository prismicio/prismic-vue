<template>
  <component :is="richTextComponent"/>
</template>

<script>
import prismicDOM from 'prismic-dom'

export default {
  name: 'PrismicRichText',
  props: {
    field: {
      required: true
    },
    /**
     * @deprecated since version 1.1.0
     * The isPlain prop is deprecated, please use the richTextAsPlain instance method instead.
     * Example:
     * ```
     * const plainText = this.$prismic.richTextAsPlain(document.data.rich_text_field)
     * ```
     */
    isPlain: {
      type: Boolean,
      required: false,
      default: false
    },
    htmlSerializer: {
      type: Function,
      required: false
    }
  },
  computed: {
    richTextComponent () {
      if (!this.field) {
        return null
      }

      let template = ''

      if (this.isPlain === false) {
        template = (`
          <div>
            ${prismicDOM.RichText.asHtml(this.field, this.$prismic.linkResolver, this.htmlSerializer || this.$prismic.htmlSerializer )}
          </div>
        `)
      } else {
        template = `<span>${prismicDOM.RichText.asText(this.field)}</span>`
      }
      return { template }
    }
  }
}
</script>
