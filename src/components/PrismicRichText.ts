import {RichText as PrismicDomRichText} from 'prismic-dom'
import Vue, {CreateElement} from 'vue'

export const PrismicRichText = new Vue({
  name: 'PrismicRichText',
  props: {
    field: {
      required: true
    },
    isPlain: {
      type: Boolean,
      required: false,
      default: false
    },
    htmlSerializer: {
      type: Function,
      required: false,
      default: null
    }
  },
  render(createElement: CreateElement) {
    if (!this.field)
      return null

    if (this.isPlain) {
      const text = PrismicDomRichText.asText(this.field)

      return createElement('span', [text])
    } else {
      const html = (PrismicDomRichText.asHtml as any)(this.field, this.$prismic.linkResolver,
        this.htmlSerializer || this.$prismic.htmlSerializer)

      return createElement('div', [html])
    }
  }
})
