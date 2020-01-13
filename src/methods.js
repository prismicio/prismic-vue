import PrismicDOM from 'prismic-dom'

export function asHtml(richText, linkResolver, htmlSerializer) {
  if (richText) {
    return PrismicDOM.RichText.asHtml(
      richText,
      linkResolver,
      htmlSerializer
    )
  }
}
export function asText(richText, joinString) {
  if (richText) {
    return PrismicDOM.RichText.asText(richText, joinString)
  }
  return ''
}

export function asLink(link, linkResolver) {
  if (link) {
    return PrismicDOM.Link.url(
      link,
      linkResolver
    )
  }
}
export function asDate(date) {
  if (date) {
    return PrismicDOM.Date(date)
  }
}