import { RichText } from "prismic-dom";

export default {
	name: "PrismicRichText",
	functional: true,
	props: {
		field: {
			type: Array,
			required: true,
		},
		linkResolver: {
			type: Function,
			required: false,
		},
		htmlSerializer: {
			type: Function,
			required: false,
		},
		wrapper: {
			type: [String, Object, Function],
			required: false,
			default: "div",
		},
	},
	render(h, { props, data, parent }) {
		const { field, linkResolver, htmlSerializer, wrapper } = props;

		if (!field) {
			return null;
		}
		const innerHTML = RichText.asHtml(
			field,
			linkResolver ? linkResolver : parent.$prismic ? parent.$prismic.linkResolver : undefined,
			htmlSerializer ? htmlSerializer : parent.$prismic ? parent.$prismic.htmlSerializer : undefined,
		);

		return h(wrapper, {
			...data,
			domProps: {
				innerHTML,
			},
		});
	},
};
