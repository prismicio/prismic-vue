import prismicJS from "@prismicio/client";
const { client } = prismicJS;

import Components from "./components";
import { asHtml, asText, asDate, asLink } from "./methods";

function attachMethods(Vue, options) {
	Vue.prototype.$prismic.asHtml = function (
		richText,
		linkResolver,
		htmlSerializer,
	) {
		return asHtml(
			richText,
			linkResolver || options.linkResolver,
			htmlSerializer || options.htmlSerializer,
		);
	};
	Vue.prototype.$prismic.asHTML = Vue.prototype.$prismic.asHtml;
	Vue.prototype.$prismic.asText = asText;
	Vue.prototype.$prismic.richTextAsPlain = asText;
	Vue.prototype.$prismic.asDate = asDate;
	Vue.prototype.$prismic.asLink = function (link, linkResolver) {
		return asLink(link, linkResolver || options.linkResolver);
	};
}

const PrismicVue = {
	install: function (Vue, options) {
		const { linkType = "vueRouter" } = options;
		Vue.prototype.$prismic = prismicJS;
		Vue.prototype.$prismic.predicate = prismicJS.Predicates;
		Vue.prototype.$prismic.cookie = {
			preview: prismicJS.previewCookie,
		};
		Vue.prototype.$prismic.endpoint = options.endpoint;
		Vue.prototype.$prismic.linkResolver = options.linkResolver;
		Vue.prototype.$prismic.htmlSerializer = options.htmlSerializer;
		Vue.prototype.$prismic.client = client(
			options.endpoint,
			options.apiOptions,
		);

		attachMethods(Vue, options);

		const components = {
			...Components.common,
			...Components[linkType],
		};

		/**
		 * Global registration of common components + stack specific components.
		 * Currently, only Nuxt links differ though. Use `linkType: 'nuxt'` in that case.
		 */
		Object.entries(components).forEach(([_, c]) => {
			Vue.component(c.name, c);
		});
	},
};

export default PrismicVue;
