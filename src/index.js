import prismicJS from 'prismic-javascript'
import prismicDOM from 'prismic-dom'

import EditButton from './components/EditButton'
import Embed from './components/Embed'
import Image from './components/Image'
import Link from './components/Link'
import RichText from './components/RichText.vue'

const PrismicVue = {
  install: function (Vue, options = {}) {
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

    Vue.component(EditButton.name, EditButton)
    Vue.component(Embed.name, Embed)
    Vue.component(Image.name, Image)
    Vue.component(Link.name, Link)
    Vue.component(RichText.name, RichText)
  }
}

export default PrismicVue
