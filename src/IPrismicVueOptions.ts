import {ApiOptions} from 'prismic-javascript/d.ts/Api'
import {Document} from 'prismic-javascript/d.ts/documents'

export type LinkResolverFunction = (doc: Document) => string

export interface IPrismicVueOptions {
  endpoint: string
  apiOptions?: ApiOptions,
  linkResolver?: LinkResolverFunction,
  // TODO: Type?
  htmlSerializer?: any
}
