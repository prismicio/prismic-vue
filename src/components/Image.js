import ImgixClient from "imgix-core-js"
import ImgixParams from "imgix-url-params";
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

    console.log(ImgixParams)

    // const {origin, pathname} = new URl(url)

    // var client = new ImgixClient({
    //   domain: origin
    // });
    // var url = client.buildURL(pathname, {
    //   w: 1000
    // });

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
