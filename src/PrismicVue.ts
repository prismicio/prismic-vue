// @ts-ignore
import prismicDOM from 'prismic-dom'
import * as prismicJS from 'prismic-javascript'
import {DefaultClient} from 'prismic-javascript/d.ts/client'
import _Vue from 'vue'
import EditButton from './components/EditButton.vue'
import Embed from './components/Embed.vue'
import Image from './components/Image.vue'
import Link from './components/Link.vue'
import RichText from './components/RichText.vue'
import {IPrismicVueOptions} from './IPrismicVueOptions'

export function PrismicVue(Vue: typeof _Vue, options: IPrismicVueOptions) {
  // Register prototypes
  Vue.prototype.$prismic = prismicJS
  Vue.prototype.$prismic.endpoint = options.endpoint
  Vue.prototype.$prismic.linkResolver = options.linkResolver
  Vue.prototype.$prismic.htmlSerializer = options.htmlSerializer
  Vue.prototype.$prismic.client = prismicJS.client(options.endpoint, options.apiOptions)

  // TODO: Type?
  Vue.prototype.$prismic.richTextAsPlain = (field: any) => {
    if (!field)
      return ''
    return prismicDOM.richTextAsPlain.asText(field)
  }

  // Register components
  Vue.component('PrismicEditButton', EditButton)
  Vue.component('PrismicEmbed', Embed)
  Vue.component('PrismicImage', Image)
  Vue.component('PrismicLink', Link)
  Vue.component('PrismicRichText', RichText)
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
