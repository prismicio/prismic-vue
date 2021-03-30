import PrismicDOM from "prismic-dom";
import type {
  PrismicPluginOptions,
  LinkResolver,
  RichTextBlock,
  HtmlSerializer,
  LinkField
} from "../types";
import { SDK, SDKWithInterface, SDKWithInterfaceKeys } from "./SDK";

export type DOMInterface = Omit<DOM, SDKWithInterfaceKeys>;

export class DOM extends SDK implements SDKWithInterface<DOMInterface> {
  constructor(options: Required<PrismicPluginOptions>) {
    super(options);
  }

  get interface(): DOMInterface {
    return {
      asText: this.asText,
      asHtml: this.asHtml,
      asLink: this.asLink,
      asDate: this.asDate
    };
  }

  asText = (richText: RichTextBlock[] = [], joinString?: string): string => {
    return PrismicDOM.RichText.asText(richText, joinString);
  };

  asHtml = (
    richText: RichTextBlock[] = [],
    linkResolver?: LinkResolver,
    htmlSerializer?: HtmlSerializer<string>
  ): string => {
    if (!linkResolver) {
      linkResolver = this.options.linkResolver;
    }
    return PrismicDOM.RichText.asHtml(richText, linkResolver, htmlSerializer);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  asLink = (link: LinkField, linkResolver?: LinkResolver): string => {
    if (!linkResolver) {
      console.log(this);
      linkResolver = this.options.linkResolver;
    }
    return PrismicDOM.Link.url(link, linkResolver);
  };

  asDate = (date?: string): string => {
    // PrismicDOM.Date() can return null
    return PrismicDOM.Date(date) || "";
  };
}
