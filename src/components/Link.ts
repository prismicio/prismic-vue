import {
  AllowedComponentProps,
  ComponentCustomProps,
  defineComponent,
  h,
  PropType,
  resolveComponent,
  VNodeProps
} from "vue";
import { LinkField, LinkResolver } from "../types";

interface PrismicLinkProps {
  field: LinkField;
  linkResolver?: LinkResolver;
}

function getLinkTag(
  href: string,
  anchorTag = "a",
  frameworkLink = "router-link"
): string {
  // regex101.com/r/LU1iFL/1
  if (/^\/(?!\/).*$/.test(href)) {
    return frameworkLink;
  } else {
    return anchorTag;
  }
}

export const PrismicLinkImpl = defineComponent({
  name: "PrismicLink",
  props: {
    field: {
      type: Object as PropType<LinkField>,
      required: true
    },
    linkResolver: {
      type: Function as PropType<LinkResolver>,
      default: undefined,
      required: false
    }
  },
  render() {
    if (!this.field) {
      return null;
    }

    const {
      anchorTag,
      frameworkLink,
      blankTargetRelAttribute
    } = this.$prismic.components.link;
    const href = this.$prismic.asLink(this.field, this.linkResolver);
    const tag = getLinkTag(href, anchorTag, frameworkLink);

    const children = this.$slots.default && this.$slots.default(href);

    switch (tag) {
      case frameworkLink:
        return h(resolveComponent(frameworkLink), { to: href }, children);

      case anchorTag:
      default:
        return h(
          anchorTag,
          {
            href,
            target: this.field.target,
            rel: this.field.target ? blankTargetRelAttribute : null
          },
          children
        );
    }
  }
});

// export the public type for h/tsx inference
// also to avoid inline import() in generated d.ts files
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PrismicLink = (PrismicLinkImpl as any) as {
  new (): {
    $props: AllowedComponentProps &
      ComponentCustomProps &
      VNodeProps &
      PrismicLinkProps;
  };
};
