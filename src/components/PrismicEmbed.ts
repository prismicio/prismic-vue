import { EmbedField } from "@prismicio/client";
import {
	AllowedComponentProps,
	ComponentCustomProps,
	ConcreteComponent,
	DefineComponent,
	PropType,
	Raw,
	VNodeProps,
	defineComponent,
	h,
} from "vue";

import { simplyResolveComponent } from "../lib/simplyResolveComponent";

/**
 * The default component rendered to wrap the embed.
 */
const defaultWrapper = "div";

/**
 * Props for `<PrismicEmbed />`.
 */
export type PrismicEmbedProps = {
	/**
	 * The Prismic embed field to render.
	 */
	field: EmbedField;

	/**
	 * An HTML tag name, a component, or a functional component used to wrap the
	 * output.
	 *
	 * @defaultValue `"div"`
	 */
	wrapper?: string | ConcreteComponent | Raw<DefineComponent>;
};

/**
 * `<PrismicEmbed />` implementation.
 *
 * @internal
 */
export const PrismicEmbedImpl = /*#__PURE__*/ defineComponent({
	name: "PrismicEmbed",
	props: {
		field: {
			type: Object as PropType<EmbedField>,
			required: true,
		},
		wrapper: {
			type: [String, Object, Function] as PropType<
				string | ConcreteComponent | Raw<DefineComponent>
			>,
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
			return h(simplyResolveComponent(props.wrapper || defaultWrapper), {
				"data-oembed": props.field.embed_url,
				"data-oembed-type": props.field.type,
				"data-oembed-provider": props.field.provider_name,
				innerHTML: props.field.html || null,
			});
		};
	},
});

// export the public type for h/tsx inference
// also to avoid inline import() in generated d.ts files
/**
 * Component to render a Prismic embed field.
 *
 * @see Component props {@link PrismicEmbedProps}
 * @see Templating embed fields {@link https://prismic.io/docs/technologies/vue-template-content#embeds}
 */
export const PrismicEmbed = PrismicEmbedImpl as unknown as {
	new (): {
		$props: AllowedComponentProps &
			ComponentCustomProps &
			VNodeProps &
			PrismicEmbedProps;
	};
};
