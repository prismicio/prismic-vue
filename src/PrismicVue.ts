import * as PrismicJS from 'prismic-javascript'
import _Vue from 'vue'
import {PrismicEditButton} from './components/PrismicEditButton'
import {PrismicEmbed} from './components/PrismicEmbed'
import {PrismicImage} from './components/PrismicImage'
import {PrismicLink} from './components/PrismicLink'
import {PrismicRichText} from './components/PrismicRichText'
import {IPrismicVueOptions} from './IPrismicVueOptions'
import './PrismicVueAugment'

export function PrismicVue(Vue: typeof _Vue, options: IPrismicVueOptions) {
  // Register prototypes
  Vue.prototype.$prismic = PrismicJS
  Vue.prototype.$prismic.endpoint = options.endpoint
  Vue.prototype.$prismic.linkResolver = options.linkResolver
  Vue.prototype.$prismic.htmlSerializer = options.htmlSerializer
  Vue.prototype.$prismic.client = PrismicJS.client(options.endpoint, options.apiOptions)

  // Register components
  Vue.component('PrismicEditButton', PrismicEditButton)
  Vue.component('PrismicEmbed', PrismicEmbed)
  Vue.component('PrismicImage', PrismicImage)
  Vue.component('PrismicLink', PrismicLink)
  Vue.component('PrismicRichText', PrismicRichText)
}
