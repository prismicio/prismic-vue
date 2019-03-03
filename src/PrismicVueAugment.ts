import * as prismicJS from 'prismic-javascript'
import {DefaultClient} from 'prismic-javascript/d.ts/client'

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
