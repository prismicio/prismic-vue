import PrismicDom from 'prismic-dom'

export default ({
  component = 'a'
}) => ({
  name: 'PrismicLink',
  functional: true,
  props: {
    field: {
      type: Object,
      required: true,
    },
    linkResolver: {
      type: Function,
      required: false,
      default () {
        return null
      }
    }
  },
  render(h, { props, data, children, parent }) {
    const { field, linkResolver } = props

    if (!field) {
      return null
    }

    const url = parent.$prismic
      ? parent.$prismic.asLink(field, linkResolver)
      : PrismicDom.Link.url(field, linkResolver)

    if (url.indexOf('/') === 0) {
      data.props = data.props || {};
      data.props.to = url;

      return h(component, data, children);
    }

    data.attrs = {
      ...data.attrs,
      href: url,
      ...field.target && {
        target: field.target,
        rel: 'noopener',
      },
    }

    return h(
      'a',
      data,
      children,
    );
  }
})
