export default {
	name: 'PrismicImage',
	functional: true,
	props: {
		field: {
			type: Object,
			required: true,
		},
	},
	render(h, { props, data }) {
		const { field } = props;
		if (!field) {
			return null
		}

		const { url, alt, copyright } = field;

		return h(
			'img',
			Object.assign(data, {
				attrs: {
					...data.attrs,
					src: url,
					alt: alt || "",
					copyright
				}
			})
		);
	},
};
