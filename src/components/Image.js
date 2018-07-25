export default {
  name: 'PrismicImage',
  props: {
    field: {
      type: Object | null,
      required: true
    }
  },
  render (h) {
    if (!this.field) {
      return h('img')
    }
    const attrs = {}
    attrs.src = this.field.url
    if (this.field.alt) {
      attrs.alt = this.field.alt
    }
    if (this.field.copyright) {
      attrs.copyright = this.field.copyright
    }
    return h('img', { attrs })
  }
}
