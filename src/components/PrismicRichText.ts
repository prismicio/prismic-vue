import {
	HTMLFunctionSerializer,
	HTMLMapSerializer,
	LinkResolverFunction,
	RichTextField,
	asHTML,
	isFilled,
} from "@prismicio/client";
import {
	AllowedComponentProps,
	Component,
	ComponentCustomProps,
	ComputedRef,
	ConcreteComponent,
	DefineComponent,
	PropType,
	Raw,
	VNodeProps,
	computed,
	defineComponent,
	h,
	inject,
	nextTick,
	onBeforeUnmount,
	ref,
	unref,
	watch,
} from "vue";
import { routerKey } from "vue-router";

import { isInternalURL } from "../lib/isInternalURL";
import { simplyResolveComponent } from "../lib/simplyResolveComponent";

import { VueUseOptions } from "../types";

import { usePrismic } from "../usePrismic";

/**
 * The default component rendered to wrap the HTML output.
 */
const defaultWrapper = "div";

/**
 * Props for `<PrismicRichText />`.
 */
export type PrismicRichTextProps = {
	/**
	 * The Prismic rich text or title field to render.
	 */
	field: RichTextField | null | undefined;

	/**
	 * A link resolver function used to resolve link when not using the route
	 * resolver parameter with `@prismicio/client`.
	 *
	 * @defaultValue The link resolver provided to `@prismicio/vue` plugin if configured.
	 *
	 * @see Link resolver documentation {@link https://prismic.io/docs/core-concepts/link-resolver-route-resolver#link-resolver}
	 */
	linkResolver?: LinkResolverFunction;

	/**
	 * An HTML serializer to customize the way rich text fields are rendered.
	 *
	 * @defaultValue The HTML serializer provided to `@prismicio/vue` plugin if configured.
	 *
	 * @see HTML serializer documentation {@link https://prismic.io/docs/core-concepts/html-serializer}
	 */
	serializer?: HTMLFunctionSerializer | HTMLMapSerializer;

	/**
	 * An HTML serializer to customize the way rich text fields are rendered.
	 *
	 * @deprecated Use `serializer` instead.
	 *
	 * @defaultValue The HTML serializer provided to `@prismicio/vue` plugin if configured.
	 *
	 * @see HTML serializer documentation {@link https://prismic.io/docs/core-concepts/html-serializer}
	 */
	htmlSerializer?: HTMLFunctionSerializer | HTMLMapSerializer;

	/**
	 * An HTML tag name, a component, or a functional component used to wrap the
	 * output.
	 *
	 * @defaultValue `"div"`
	 */
	wrapper?: string | ConcreteComponent | Raw<DefineComponent>;

	/**
	 * The HTML value to be rendered when the field is empty. If a fallback is not
	 * given, `""` (nothing) will be rendered.
	 */
	fallback?: string;
};

/**
 * Options for {@link usePrismicRichText}.
 */
export type UsePrismicRichTextOptions = VueUseOptions<
	Omit<PrismicRichTextProps, "wrapper">
>;

/**
 * Return type of {@link usePrismicRichText}.
 */
export type UsePrismicRichTextReturnType = {
	/**
	 * Serialized rich text field as HTML.
	 */
	html: ComputedRef<string>;
};

/**
 * A low level composable that returns a serialized rich text field as HTML.
 *
 * @param props - {@link UsePrismicRichTextOptions}
 *
 * @returns - Serialized rich text field as HTML
 *   {@link UsePrismicRichTextReturnType}
 */
export const usePrismicRichText = (
	props: UsePrismicRichTextOptions,
): UsePrismicRichTextReturnType => {
	const { options } = usePrismic();

	const html = computed(() => {
		const field = unref(props.field);

		if (!isFilled.richText(field)) {
			return unref(props.fallback) ?? "";
		}

		const linkResolver = unref(props.linkResolver) ?? options.linkResolver;
		const serializer =
			unref(props.serializer) ??
			unref(props.htmlSerializer) ??
			options.richTextSerializer ??
			options.htmlSerializer;

		return asHTML(unref(field), linkResolver, serializer);
	});

	return {
		html,
	};
};

/**
 * `<PrismicRichText />` implementation.
 *
 * @internal
 */
export const PrismicRichTextImpl = /*#__PURE__*/ defineComponent({
	name: "PrismicRichText",
	props: {
		field: {
			type: Array as unknown as PropType<RichTextField | null | undefined>,
			default: undefined,
			required: false,
		},
		linkResolver: {
			type: Function as PropType<LinkResolverFunction>,
			default: undefined,
			required: false,
		},
		serializer: {
			type: [Function, Object] as PropType<
				HTMLFunctionSerializer | HTMLMapSerializer
			>,
			default: undefined,
			required: false,
		},
		htmlSerializer: {
			type: [Function, Object] as PropType<
				HTMLFunctionSerializer | HTMLMapSerializer
			>,
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
		const { html } = usePrismicRichText(props);

		const root = ref<HTMLElement | Comment | Component | null>(null);

		const maybeRouter = inject(routerKey, null);
		if (maybeRouter) {
			type InternalLink = {
				element: HTMLAnchorElement;
				listener: EventListener;
			};
			let links: InternalLink[] = [];

			const navigate: EventListener = function (
				this: { href: string },
				event: Event,
			) {
				event.preventDefault();
				maybeRouter.push(this.href);
			};

			const addListeners = () => {
				const node: HTMLElement | Comment | null =
					root.value && "$el" in root.value ? root.value.$el : root.value;
				if (node && "querySelectorAll" in node) {
					// Get all internal link tags and add listeners on them
					links = Array.from(node.querySelectorAll("a"))
						.map((element) => {
							const href = element.getAttribute("href");

							if (href && isInternalURL(href)) {
								const listener = navigate.bind({ href });
								element.addEventListener("click", listener);

								return { element, listener };
							} else {
								return false;
							}
						})
						.filter((link): link is InternalLink => link as boolean);
				}
			};

			const removeListeners = () => {
				links.forEach(({ element, listener }) =>
					element.removeEventListener("click", listener),
				);
				links = [];
			};

			watch(
				html,
				() => {
					removeListeners();
					nextTick(addListeners);
				},
				{ immediate: true },
			);

			onBeforeUnmount(() => {
				removeListeners();
			});
		}

		return () => {
			return h(simplyResolveComponent(props.wrapper || defaultWrapper), {
				innerHTML: html.value,
				ref: root,
			});
		};
	},
});

// export the public type for h/tsx inference
// also to avoid inline import() in generated d.ts files
/**
 * Component to render a Prismic rich text field as HTML.
 *
 * @see Component props {@link PrismicRichTextProps}
 * @see Templating rich text and title fields {@link https://prismic.io/docs/technologies/vue-template-content#rich-text-and-titles}
 */
export const PrismicRichText = PrismicRichTextImpl as unknown as {
	new (): {
		$props: AllowedComponentProps &
			ComponentCustomProps &
			VNodeProps &
			PrismicRichTextProps;
	};
};
