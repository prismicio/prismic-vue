import {
	AllowedComponentProps,
	Component,
	ComponentCustomProps,
	computed,
	ComputedRef,
	ConcreteComponent,
	defineComponent,
	h,
	inject,
	nextTick,
	onBeforeUnmount,
	PropType,
	ref,
	unref,
	VNodeProps,
	watch,
} from "vue";
import { routerKey } from "vue-router";
import escapeHTML from "escape-html";

import {
	asHTML,
	asLink,
	HTMLFunctionSerializer,
	HTMLMapSerializer,
	LinkResolverFunction,
	Element,
} from "@prismicio/helpers";
import { LinkType, RichTextField, RTLinkNode } from "@prismicio/types";

import { VueUseOptions } from "../types";
import { usePrismic } from "../usePrismic";
import { simplyResolveComponent } from "../lib/simplyResolveComponent";
import { composeSerializers, wrapMapSerializer } from "@prismicio/richtext";
import { isInternalURL } from "../lib/isInternalURL";

/**
 * The default component rendered to wrap the HTML output.
 */
const defaultWrapper = "div";

/**
 * Props for `<PrismicRichText />`.
 */
export type PrismicRichTextProps = {
	/** The Prismic rich text or title field to render. */
	field: RichTextField;

	/**
	 * A link resolver function used to resolve link when not using the route resolver parameter with `@prismicio/client`.
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
	htmlSerializer?: HTMLFunctionSerializer | HTMLMapSerializer;

	/**
	 * An HTML tag name, a component, or a functional component used to wrap the output.
	 *
	 * @defaultValue `"div"`
	 */
	wrapper?: string | ConcreteComponent;
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
	/** Serialized rich text field as HTML. */
	html: ComputedRef<string>;
};

/**
 * Serializes hyperlink for Vue, applying `data-router-link` attribute to internal links for usage with Vue Router.
 *
 * @param linkResolver - A link resolver function to use
 * @param node - The link node to serialize
 * @param children - The children of the link node
 *
 * @returns Serialized hyperlink
 */
const serializeVueHyperlink = (
	linkResolver: LinkResolverFunction | undefined,
	node: RTLinkNode,
	children: string[],
) => {
	switch (node.data.link_type) {
		case LinkType.Web: {
			return `<a href="${escapeHTML(node.data.url)}" target="${
				node.data.target
			}" rel="noopener noreferrer">${children.join("")}</a>`;
		}

		case LinkType.Document: {
			return `<a data-router-link href="${asLink(
				node.data,
				linkResolver,
			)}">${children.join("")}</a>`;
		}

		case LinkType.Media: {
			return `<a href="${node.data.url}">${children.join("")}</a>`;
		}
	}
};

/**
 * A low level composable that returns a serialized rich text field as HTML.
 *
 * @param props - {@link UsePrismicRichTextOptions}
 *
 * @returns - Serialized rich text field as HTML {@link UsePrismicRichTextReturnType}
 */
export const usePrismicRichText = (
	props: UsePrismicRichTextOptions,
): UsePrismicRichTextReturnType => {
	const { options } = usePrismic();

	const html = computed(() => {
		const linkResolver = unref(props.linkResolver) ?? options.linkResolver;

		const maybeSerializer =
			unref(props.htmlSerializer) ?? options.htmlSerializer;
		// Extends default HTML serializer to handle Vue Router links
		let serializer: HTMLFunctionSerializer = (
			_type,
			node,
			_content,
			children,
			_key,
		) => {
			switch (node.type) {
				case Element.hyperlink:
					return serializeVueHyperlink(linkResolver, node, children);
				default:
					return null;
			}
		};
		if (maybeSerializer) {
			serializer = composeSerializers(
				typeof maybeSerializer === "object"
					? wrapMapSerializer(maybeSerializer)
					: maybeSerializer,
				serializer,
			);
		}

		return asHTML(unref(props.field), linkResolver, serializer);
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
			type: Array as PropType<RichTextField>,
			required: true,
		},
		linkResolver: {
			type: Function as PropType<LinkResolverFunction>,
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
			type: [String, Object, Function] as PropType<string | ConcreteComponent>,
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

		const root = ref<HTMLElement | Component | null>(null);

		const maybeRouter = inject(routerKey, null);
		if (maybeRouter) {
			let links: NodeList | null = null;

			const navigate: EventListener = (event: Event) => {
				let target = event.target as (Node & ParentNode) | null;
				let i = 0;
				// Go throught 5 parents max to find a tag
				while (
					i < 5 &&
					target &&
					!(target instanceof HTMLAnchorElement) &&
					target.parentNode
				) {
					target = target.parentNode;
					i++;
				}

				// If target is still not a link, ignore
				if (!(target instanceof HTMLAnchorElement)) {
					return;
				}

				const href = target.getAttribute("href");
				// Get link target, if internal link, navigate with router link
				if (href && isInternalURL(href)) {
					event.preventDefault();
					maybeRouter.push(href);
				}
			};

			const addListeners = () => {
				const node: HTMLElement | null =
					root.value && "$el" in root.value ? root.value.$el : root.value;
				links =
					node &&
					node.querySelectorAll &&
					node.querySelectorAll("a[data-router-link]");
				links &&
					links.forEach((link) => link.addEventListener("click", navigate));
			};

			const removeListeners = () => {
				links?.forEach((link) => link.removeEventListener("click", navigate));
				links = null;
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
