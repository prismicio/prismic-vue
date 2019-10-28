import { RichText } from 'prismic-dom'

export default {
  name: 'PrismicRichText',
  functional: true,
  props: {
    field: {
      type: Array,
      required: true,
    },
    htmlSerializer: {
      type: Function,
      required: false,
    },
    wrapper: {
      type: String,
      required: false,
      default: 'div',
    }
  },
  render(h, {
    props, data, children, parent
  }) {
    const { field, htmlSerializer, wrapper } = props

    const innerHTML = RichText.asHtml(
      field,
      parent.$prismic.linkResolver,
      htmlSerializer || parent.$prismic.htmlSerializer
    )

    return h(
      wrapper,
      {
        ...data,
        domProps: {
          innerHTML
        },
      },
    )
  }
}
