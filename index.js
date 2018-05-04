import prismic from 'prismic-javascript';

import EditButton from './components/EditButton';
import Embed from './components/Embed';
import Image from './components/Image';
import Link from './components/Link';
import RichText from './components/RichText';

export default {
  install: function (Vue, options = {}) {
    Vue.prototype.$prismic = prismic;
    Vue.prototype.$prismic.endpoint = options.endpoint;

    Vue.component('PrismicEditButton', EditButton);
    Vue.component('PrismicEmbed', Embed);
    Vue.component('PrismicImage', Image);
    Vue.component('PrismicLink', Link);
    Vue.component('PrismicRichText', RichText);
  }
};
