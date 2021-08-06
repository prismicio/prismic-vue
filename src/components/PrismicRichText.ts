import {
	AllowedComponentProps,
	ComponentCustomProps,
	computed,
	ComputedRef,
	ConcreteComponent,
	defineComponent,
	h,
	PropType,
	unref,
	VNodeProps,
} from "vue";

import {
	asHTML,
	HTMLFunctionSerializer,
	HTMLMapSerializer,
	LinkResolverFunction,
} from "@prismicio/helpers";
import { RichTextField } from "@prismicio/types";

import { VueUseOptions } from "../types";
import { usePrismic } from "../usePrismic";
import { simplyResolveComponent } from "../lib/simplyResolveComponent";

/**
 * The default component rendered to wrap the HTML output.
 */
const defaultWrapper = "div";

export type PrismicRichTextProps = {
	field: RichTextField;
	linkResolver?: LinkResolverFunction;
	htmlSerializer?: HTMLFunctionSerializer | HTMLMapSerializer;
	wrapper?: string | ConcreteComponent;
};

export type UsePrismicRichTextOptions = VueUseOptions<
	Omit<PrismicRichTextProps, "wrapper">
>;

export const usePrismicRichText = (
	props: UsePrismicRichTextOptions,
): { html: ComputedRef<string> } => {
	const { options } = usePrismic();

	const html = computed(() => {
		const linkResolver = unref(props.linkResolver) ?? options.linkResolver;
		const htmlSerializer =
			unref(props.htmlSerializer) ?? options.htmlSerializer;

		return asHTML(unref(props.field), linkResolver, htmlSerializer);
	});

	return {
		html,
	};
};

export const PrismicRichTextImpl = defineComponent({
	name: "PrismicRichText",
	props: {
		field: {
			type: Array as PropType<RichTextField>,
			required: true,
		},
		linkResolver: {
			type: Function as PropType<LinkResolverFunction>,
			default: undefined,
			required: false,
		},
		htmlSerializer: {
			type: Function as PropType<HTMLFunctionSerializer | HTMLMapSerializer>,
			default: undefined,
			required: false,
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

		const { html } = usePrismicRichText(props);

		return () => {
			return h(simplyResolveComponent(props.wrapper || defaultWrapper), {
				innerHTML: html.value,
			});
		};
	},
});

// export the public type for h/tsx inference
// also to avoid inline import() in generated d.ts files
export const PrismicRichText = PrismicRichTextImpl as unknown as {
	new (): {
		$props: AllowedComponentProps &
			ComponentCustomProps &
			VNodeProps &
			PrismicRichTextProps;
	};
};
