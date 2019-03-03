import * as prismicJS from 'prismic-javascript'
import {DefaultClient} from 'prismic-javascript/d.ts/client'
import _Vue from 'vue'
import {PrismicEditButton} from './components/EditButton'
import {PrismicEmbed} from './components/Embed'
import {PrismicImage} from './components/Image'
import {PrismicLink} from './components/Link'
import {PrismicRichText} from './components/RichText'
import {IPrismicVueOptions} from './IPrismicVueOptions'

export function PrismicVue(Vue: typeof _Vue, options: IPrismicVueOptions) {
  // Register prototypes
  Vue.prototype.$prismic = prismicJS
  Vue.prototype.$prismic.endpoint = options.endpoint
  Vue.prototype.$prismic.linkResolver = options.linkResolver
  Vue.prototype.$prismic.htmlSerializer = options.htmlSerializer
  Vue.prototype.$prismic.client = prismicJS.client(options.endpoint, options.apiOptions)

  // Register components
  Vue.component('PrismicEditButton', PrismicEditButton)
  Vue.component('PrismicEmbed', PrismicEmbed)
  Vue.component('PrismicImage', PrismicImage)
  Vue.component('PrismicLink', PrismicLink)
  Vue.component('PrismicRichText', PrismicRichText)
}

// Augment Vue
declare module 'vue/types/vue' {
  // tslint:disable-next-line:interface-name
  interface Vue {
    $prismic: {
      Predicates: typeof prismicJS.Predicates,
      Experiments: typeof prismicJS.Experiments
      Api: typeof prismicJS.Api
      client: DefaultClient,
      getApi: typeof prismicJS.getApi
      api: typeof prismicJS.api
    }
  }
}
