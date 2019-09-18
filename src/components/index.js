import Embed from './Embed'
import Image from './Image'
import Link from './Link'
import RichText from './RichText'

const NuxtLink = Link('nuxt-link', 'PrismicNuxtLink')
const VueRouterLink = Link()

const exp = {
  common: {
    Embed,
    Image,
    RichText,
  },
  nuxt: {
    Link: NuxtLink,
  },
  vueRouter: {
    Link: VueRouterLink,
  }
}

export const common = exp.common
export const nuxt = exp.nuxt
export const vueRouter = exp.vueRouter

export default exp
