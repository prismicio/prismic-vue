import {
	AllowedComponentProps,
	ComponentCustomProps,
	ConcreteComponent,
	defineComponent,
	h,
	PropType,
	VNodeProps,
} from "vue";

import { EmbedField } from "@prismicio/types";
import { simplyResolveComponent } from "../lib/simplyResolveComponent";

/**
 * The default component rendered to wrap the embed
 */
const defaultWrapper = "div";

export type PrismicEmbedProps = {
	field: EmbedField;
	wrapper?: string | ConcreteComponent;
};

export const PrismicEmbedImpl = defineComponent({
	name: "PrismicEmbed",
	props: {
		field: {
			type: Object as PropType<EmbedField>,
			required: true,
		},
		wrapper: {
			type: [String, Object] as PropType<string | ConcreteComponent>,
			default: undefined,
			required: false,
		},
	},
	setup(props) {
		// Prevent fatal if user didn't check for field, throws `Invalid prop` warn
		if (!props.field) {
			return () => null;
		}

		return () => {
			return h(simplyResolveComponent(props.wrapper ?? defaultWrapper), {
				"data-oembed": props.field.embed_url || null,
				"data-oembed-type": props.field.type || null,
				"data-oembed-provider": props.field.provider_name || null,
				innerHTML: props.field.html || null,
			});
		};
	},
});

// export the public type for h/tsx inference
// also to avoid inline import() in generated d.ts files
export const PrismicEmbed = PrismicEmbedImpl as unknown as {
	new (): {
		$props: AllowedComponentProps &
			ComponentCustomProps &
			VNodeProps &
			PrismicEmbedProps;
	};
};
