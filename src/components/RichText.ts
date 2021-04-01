import {
  AllowedComponentProps,
  ComponentCustomProps,
  defineComponent,
  h,
  PropType,
  VNodeProps
} from "vue";
import { RichTextField, LinkResolver, HtmlSerializer } from "../types";

interface PrismicRichTextProps {
  field: RichTextField;
  linkResolver?: LinkResolver;
  htmlSerializer?: HtmlSerializer<string>;
  wrapper?: string;
}

export const PrismicRichTextImpl = defineComponent({
  name: "PrismicRichText",
  props: {
    field: {
      type: Object as PropType<RichTextField>,
      required: true
    },
    linkResolver: {
      type: Function as PropType<LinkResolver | undefined>,
      default: undefined,
      required: false
    },
    htmlSerializer: {
      type: Function as PropType<HtmlSerializer<string> | undefined>,
      default: undefined,
      required: false
    },
    wrapper: {
      type: String as PropType<string>,
      required: false,
      default: "div"
    }
  },
  render() {
    if (!this.field) {
      return null;
    }

    const html = this.$prismic.asHtml(
      this.field,
      this.linkResolver,
      this.htmlSerializer
    );

    return h(this.wrapper, { innerHTML: html });
  }
});

// export the public type for h/tsx inference
// also to avoid inline import() in generated d.ts files
export const PrismicRichText = (PrismicRichTextImpl as any) as {
  new (): {
    $props: AllowedComponentProps &
      ComponentCustomProps &
      VNodeProps &
      PrismicRichTextProps;
  };
};
