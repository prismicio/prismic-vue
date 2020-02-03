import PrismicDom from 'prismic-dom'

export default (linkComponent = 'router-link') => ({
  name: 'PrismicLink',
  functional: true,
  props: {
    field: {
      type: Object,
      required: true,
    },
  },
  render(h, {
    props, data, children, parent,
  }) {
    const { field } = props;

    if (!field) {
      return null
    }

    const url = linkComponent === 'nuxt-link' ? parent.$prismic.asLink(field)
    : PrismicDom.Link.url(field, parent.$prismic.linkResolver)

     // Internal link
    if (['Link.Document', 'Document'].includes(field.link_type)) {
      data.props = data.props || {};
      data.props.to = url;

       return h(
        linkComponent,
        data,
        children,
      );
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
  },
});
