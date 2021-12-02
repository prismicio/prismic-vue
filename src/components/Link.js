import PrismicDom from "prismic-dom";

const isInternalURL = (url) => {
	/**
	 * @see Regex101 expression: {@link https://regex101.com/r/1y7iod/1}
	 */
	const isInternal = /^\/(?!\/)/.test(url);
	/**
	 * @see Regex101 expression: {@link https://regex101.com/r/RnUseS/1}
	 */
	const isSpecialLink = !isInternal && !/^https?:\/\//i.test(url);

	return isInternal && !isSpecialLink;
};

export default ({ component = "a" }) => ({
	name: "PrismicLink",
	functional: true,
	props: {
		field: {
			type: Object,
			required: true,
		},
		linkResolver: {
			type: Function,
			required: false,
		},
		target: {
			type: String,
			default: undefined,
			required: false,
		},
		rel: {
			type: String,
			default: undefined,
			required: false,
		},
		blankTargetRelAttribute: {
			type: String,
			default: "noopener noreferrer",
			required: false,
		},
	},
	render(h, { props, data, children, parent }) {
		const { field, linkResolver } = props;

		if (!field) {
			return null;
		}

		const url = parent.$prismic
			? parent.$prismic.asLink(field, linkResolver)
			: PrismicDom.Link.url(
					field,
					linkResolver ||
						function () {
							return null;
						}
			  );

		if (isInternalURL(url) && !props.target) {
			data.props = data.props || {};
			data.props.to = url;

			return h(component, data, children);
		}

		data.attrs = {
			...data.attrs,
			href: url,
		};

		if (typeof props.target !== "undefined") {
			data.attrs.target = props.target;
		} else if (field.target) {
			data.attrs.target = field.target;
		}

		if (typeof props.rel !== "undefined") {
			data.attrs.rel = props.rel;
		} else if (data.attrs.target === "_blank") {
			data.attrs.rel = props.blankTargetRelAttribute;
		}

		return h("a", data, children);
	},
});
