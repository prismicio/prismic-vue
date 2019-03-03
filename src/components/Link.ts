import {Link as PrismicDomLink} from 'prismic-dom'
import Vue, {CreateElement} from 'vue'

export const PrismicLink = new Vue({
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
      const domProps: { [key: string]: string } = {}

      if (this.field.target)
        domProps.target = this.field.target

      return createElement('a', {domProps}, [
        createElement('slot')
      ])
    }
  }
})