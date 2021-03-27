import PrismicDOM from "prismic-dom";
import type {
  HtmlSerializer,
  SdkWithInterface,
  LinkResolver,
  PrismicPluginOptions,
  RichTextBlock
} from "../types";

export type DOMInterface = Omit<DOM, "interface" | "options">;

export class DOM implements SdkWithInterface<DOMInterface> {
  constructor(public options: Required<PrismicPluginOptions>) {}

  get interface(): DOMInterface {
    return {
      asText: this.asText,
      asHtml: this.asHtml,
      asLink: this.asLink,
      asDate: this.asDate
    };
  }

  asText(richText: RichTextBlock[] = [], joinString?: string): string {
    return PrismicDOM.RichText.asText(richText, joinString);
  }

  asHtml(
    richText: RichTextBlock[] = [],
    linkResolver?: LinkResolver,
    htmlSerializer?: HtmlSerializer<string>
  ): string {
    if (!linkResolver) {
      linkResolver = this.options.linkResolver;
    }
    return PrismicDOM.RichText.asHtml(richText, linkResolver, htmlSerializer);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  asLink(link: any, linkResolver?: LinkResolver): string {
    if (!linkResolver) {
      linkResolver = this.options.linkResolver;
    }
    return PrismicDOM.Link.url(link, linkResolver);
  }

  asDate(date?: string): string {
    // PrismicDOM.Date() can return null
    return PrismicDOM.Date(date) || "";
  }
}
