import prismicJS from 'prismic-javascript'
import prismicDOM from 'prismic-dom'

import Components from './components'

const PrismicVue = {
  install: function (Vue, options) {
    const { linkType = 'vueRouter' } = options
    Vue.prototype.$prismic = prismicJS
    Vue.prototype.$prismic.endpoint = options.endpoint
    Vue.prototype.$prismic.linkResolver = options.linkResolver
    Vue.prototype.$prismic.htmlSerializer = options.htmlSerializer
    Vue.prototype.$prismic.client = prismicJS.client(options.endpoint, options.apiOptions)
    Vue.prototype.$prismic.richTextAsPlain = function (field) {
      if (!field) {
        return ''
      }
      return prismicDOM.RichText.asText(field)
    }

    const components = {
      ...Components.common,
      ...Components[linkType]
    }

    Object.entries(components)
    .forEach(([_, c]) => {
      Vue.component(c.name, c)
    })
  }
}

export default PrismicVue
