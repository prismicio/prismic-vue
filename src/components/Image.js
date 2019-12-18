export default {
  name: 'PrismicImage',
  functional: true,
  props: {
    field: {
      type: Object,
      required: true,
    },
  },
  render(h, { props, data }) {
    const { url, alt, copyright } = props.field;

    return h(
      'img',
      Object.assign(data, {
        attrs: {
          ...data.attrs,
          src: url,
          alt,
          copyright
        }
      })
    );
  },
};
