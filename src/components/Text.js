import { RichText } from "prismic-dom";

export default {
	name: "PrismicText",
	functional: true,
	props: {
		field: {
			type: Array,
			required: true,
		},
		separator: {
			type: String,
			default: undefined,
			required: false,
		},
		wrapper: {
			type: [String, Object, Function],
			required: false,
			default: "div",
		},
	},
	render(h, { props, data, children, parent }) {
		const { field, separator, wrapper } = props;

		if (!field) {
			return null;
		}
		const innerHTML = RichText.asText(field, separator);

		return h(wrapper, {
			...data,
			domProps: {
				innerHTML,
			},
		});
	},
};
