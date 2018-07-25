import prismicDOM from 'prismic-dom'

export default {
  name: 'PrismicLink',
  props: {
    field: {
      type: Object | null,
      required: true
    }
  },
  render (h) {
    if (!this.field) {
      return h('a', this.$slots.default)
    }
    const url = prismicDOM.Link.url(this.field, this.$prismic.linkResolver)
    if (this.field.link_type === 'Document') {
      const attrs = {
        to: url
      }
      return h('router-link', { attrs }, this.$slots.default)
    } else {
      const attrs = {
        href: url
      }
      if (this.field.target) {
        attrs.target = this.field.target
        attrs.rel = 'noopener'
      }
      return h('a', { attrs }, this.$slots.default)
    }
  }
}
