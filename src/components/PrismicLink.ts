import {Link as PrismicDomLink} from 'prismic-dom'
import Vue, {ComponentOptions, CreateElement} from 'vue'

export const PrismicLink: ComponentOptions<Vue> = {
  name: 'PrismicLink',
  props: {
    field: {
      required: true
    }
  },
  render(createElement: CreateElement) {
    if (!this.field)
      return null

    // Resolve the url with prismic-dom
    const url = PrismicDomLink.url(this.field, this.$prismic.linkResolver)

    // Build the element
    if (this.field.link_type === 'Document') {
      // TODO: Option if using vue-router
      return createElement('router-link', {
        props: {
          to: url
        }
      })
    } else {
      const attrs: { [key: string]: string } = {}

      if (this.field.target)
        attrs.target = this.field.target

      return createElement('a', {attrs}, [
        createElement('slot')
      ])
    }
  }
}
