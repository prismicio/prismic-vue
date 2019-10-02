export default {
  name: 'PrismicEmbed',
  functional: true,
  props: {
    field: {
      type: Object,
      required: true,
    },
    wrapper: {
      type: String,
      required:false,
      default: 'div',
    },
  },
  render (h, {
    props, data, children, parent,
  }) {
    const { field } = props
    if (!field || !field.html) {
      return null
    }

    const {
      embed_url,
      type,
      provider_name,
    } = field

    const attrs = {
      ...embed_url && { 'data-oembed': embed_url },
      ...type && { 'data-oembed-type': type },
      ...provider_name && { 'data-oembed-provider': provider_name },
    }

    return h(wrapper, {
      attrs,
      domProps: {
        innerHTML: field.html
      },
    })
  }
}
