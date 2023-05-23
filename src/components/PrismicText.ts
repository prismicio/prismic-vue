import { RichTextField, asText, isFilled } from "@prismicio/client";
import {
	AllowedComponentProps,
	ComponentCustomProps,
	ComputedRef,
	ConcreteComponent,
	DefineComponent,
	PropType,
	Raw,
	VNode,
	VNodeProps,
	computed,
	defineComponent,
	h,
	unref,
} from "vue";

import { simplyResolveComponent } from "../lib/simplyResolveComponent";

import { VueUseOptions } from "../types";

/**
 * The default component rendered to wrap the text output.
 */
const defaultWrapper = "div";
/**
 * Props for `<PrismicText />`.
 */
export type PrismicTextProps = {
	/**
	 * The Prismic rich text or title field to render.
	 */
	field: RichTextField | null | undefined;

	/**
	 * Separator used to join each element.
	 *
	 * @defaultValue `" "` (a space)
	 */
	separator?: string;

	/**
	 * An HTML tag name, a component, or a functional component used to wrap the
	 * output.
	 *
	 * @defaultValue `"div"`
	 */
	wrapper?: string | ConcreteComponent | Raw<DefineComponent>;

	/**
	 * The string value to be rendered when the field is empty. If a fallback is
	 * not given, `""` (nothing) will be rendered.
	 */
	fallback?: string;
};

/**
 * Options for {@link usePrismicText}.
 */
export type UsePrismicTextOptions = VueUseOptions<
	Omit<PrismicTextProps, "wrapper">
>;

/**
 * Return type of {@link usePrismicText}.
 */
export type UsePrismicTextReturnType = {
	/**
	 * Serialized rich text field as plain text.
	 */
	text: ComputedRef<string>;
};

/**
 * A low level composable that returns a serialized rich text field as plain
 * text.
 *
 * @param props - {@link UsePrismicTextOptions}
 *
 * @returns - Serialized rich text field as plain text
 *   {@link UsePrismicTextReturnType}
 */
export const usePrismicText = (
	props: UsePrismicTextOptions,
): UsePrismicTextReturnType => {
	const text = computed(() => {
		const field = unref(props.field);

		if (!isFilled.richText(field)) {
			return unref(props.fallback) ?? "";
		}

		return asText(unref(field), unref(props.separator));
	});

	return {
		text,
	};
};

/**
 * `<PrismicText />` implementation.
 *
 * @internal
 */
export const PrismicTextImpl = /*#__PURE__*/ defineComponent({
	name: "PrismicText",
	props: {
		field: {
			type: Array as unknown as PropType<RichTextField | null | undefined>,
			default: undefined,
			required: false,
		},
		separator: {
			type: String as PropType<string>,
			default: undefined,
			required: false,
		},
		wrapper: {
			type: [String, Object, Function] as PropType<
				string | ConcreteComponent | Raw<DefineComponent>
			>,
			default: undefined,
			required: false,
		},
		fallback: {
			type: String as PropType<string>,
			default: undefined,
			required: false,
		},
	},
	setup(props) {
		const { text } = usePrismicText(props);

		return () => {
			const parent = simplyResolveComponent(props.wrapper || defaultWrapper);

			// This works but is absurd
			// if (typeof parent === "string") {
			// 	return h(parent, null, { default: () => text.value });
			// } else {
			// 	return h(parent, null, { default: () => text.value });
			// }

			return h(parent as VNode, null, {
				default: () => text.value,
			});
		};
	},
});

// export the public type for h/tsx inference
// also to avoid inline import() in generated d.ts files
/**
 * Component to render a Prismic rich text field as plain text.
 *
 * @see Component props {@link PrismicTextProps}
 * @see Templating rich text and title fields {@link https://prismic.io/docs/technologies/vue-template-content#rich-text-and-titles}
 */
export const PrismicText = PrismicTextImpl as unknown as {
	new (): {
		$props: AllowedComponentProps &
			ComponentCustomProps &
			VNodeProps &
			PrismicTextProps;
	};
};
