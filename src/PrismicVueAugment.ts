import * as PrismicJS from 'prismic-javascript'
import {DefaultClient} from 'prismic-javascript/d.ts/client'

// Augment Vue
declare module 'vue/types/vue' {
  // tslint:disable-next-line:interface-name
  interface Vue {
    $prismic: {
      Predicates: typeof PrismicJS.Predicates,
      Experiments: typeof PrismicJS.Experiments
      Api: typeof PrismicJS.Api
      client: DefaultClient,
      getApi: typeof PrismicJS.getApi
      api: typeof PrismicJS.api
    }
  }
}
