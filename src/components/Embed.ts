import {
	AllowedComponentProps,
	ComponentCustomProps,
	defineComponent,
	h,
	PropType,
	VNodeProps,
} from "vue";
import { EmbedField } from "../types";

export interface PrismicEmbedProps {
	field: EmbedField;
	wrapper?: string;
}

export const PrismicEmbedImpl = defineComponent({
	name: "PrismicEmbed",
	props: {
		field: {
			type: Object as PropType<EmbedField>,
			required: true,
		},
		wrapper: {
			type: String as PropType<string>,
			required: false,
			default: "div",
		},
	},
	render() {
		if (!this.field) {
			return null;
		}

		const { html, embed_url, type, provider_name } = this.field;

		return h(this.wrapper, {
			"data-oembed": embed_url,
			"data-oembed-type": type,
			"data-oembed-provider": provider_name,
			innerHTML: html,
		});
	},
});

// export the public type for h/tsx inference
// also to avoid inline import() in generated d.ts files
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PrismicEmbed = PrismicEmbedImpl as any as {
	new (): {
		$props: AllowedComponentProps &
			ComponentCustomProps &
			VNodeProps &
			PrismicEmbedProps;
	};
};
