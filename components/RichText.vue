<template>
  <component :is="richTextComponent"/>
</template>

<script>
import prismicDOM from 'prismic-dom';

export default {
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
      default: this.defaultHtmlSerializer
    }
  },
  data () {
    return {
      defaultHtmlSerializer (type, element, content, children) {
        const Elements = prismicDOM.RichText.Elements;

        if (type === Elements.hyperlink) {
          let result = '';
          const url = prismicDOM.Link.url(element.data, this.$prismic.linkResolver);

          if (element.data.link_type === 'Document') {
            result = `<router-link to="${url}">${content}</router-link>`;
          } else {
            const target = element.data.target ? `target="'${element.data.target}'" rel="noopener"` : '';
            result = `<a href="${url}" ${target}>${content}</a>`;
          }
          return result;
        }

        if (type === Elements.image) {
          let result = `<img src="${element.url}" alt="${element.alt || ''}" copyright="${element.copyright || ''}">`;

          if (element.linkTo) {
            const url = prismicDOM.Link.url(element.linkTo, this.$prismic.linkResolver);

            if (element.linkTo.link_type === 'Document') {
              result = `<router-link to="${url}">${result}</router-link>`;
            } else {
              const target = element.linkTo.target ? `target="${element.linkTo.target}" rel="noopener"` : '';
              result = `<a href="${url}" ${target}>${result}</a>`;
            }
          }
          const wrapperClassList = [element.label || '', 'block-img'];
          result = `<p class="${wrapperClassList.join(' ')}">${result}</p>`;
          return result;
        }

        return null;
      }
    };
  },
  computed: {
    richTextComponent () {
      if (!this.field) {
        return null;
      }

      let template = '';

      if (this.isPlain === false) {
        template = (`
          <div>
            ${prismicDOM.RichText.asHtml(this.field, this.$prismic.linkResolver, this.htmlSerializer)}
          </div>
        `);
      } else {
        template = `<span>${prismicDOM.RichText.asText(this.field)}</span>`;
      }
      return { template };
    }
  }
};
</script>
