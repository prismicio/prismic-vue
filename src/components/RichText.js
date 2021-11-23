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
			type: String,
			required: false,
			default: "div",
		},
	},
	render(h, { props, data, children, parent }) {
		const { field, linkResolver, htmlSerializer, wrapper } = props;

		if (!field) {
			return null;
		}
		const innerHTML = RichText.asHtml(
			field,
			linkResolver || parent.$prismic.linkResolver,
			htmlSerializer || parent.$prismic.htmlSerializer
		);

		return h(wrapper, {
			...data,
			domProps: {
				innerHTML,
			},
		});
	},
};
