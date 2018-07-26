export default {
  name: 'PrismicEmbed',
  props: {
    field: {
      type: Object | null,
      required: true
    }
  },
  render (h) {
    if (!this.field) {
      return h('div')
    }
    const attrs = {}
    if (this.field.embed_url) {
      attrs['data-oembed'] = this.field.embed_url
    }
    if (this.field.type) {
      attrs['data-oembed-type'] = this.field.type
    }
    if (this.field.provider_name) {
      attrs['data-oembed-provider'] = this.field.provider_name
    }
    return h('div', {
      attrs,
      domProps: {
        innerHTML: this.field.html
      }
    })
  }
}
