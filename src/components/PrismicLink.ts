import {
	LinkField,
	LinkResolverFunction,
	PrismicDocument,
	asLink,
} from "@prismicio/client";
import {
	AllowedComponentProps,
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
	reactive,
	unref,
} from "vue";

import { getSlots } from "../lib/getSlots";
import { isInternalURL } from "../lib/isInternalURL";
import { simplyResolveComponent } from "../lib/simplyResolveComponent";

import { VueUseOptions } from "../types";

import { usePrismic } from "../usePrismic";

/**
 * The default component rendered for internal URLs.
 */
const defaultInternalComponent = "router-link";

/**
 * The default component rendered for external URLs.
 */
const defaultExternalComponent = "a";

/**
 * The default rel attribute rendered for blank target URLs.
 */
const defaultBlankTargetRelAttribute = "noopener noreferrer";

/**
 * Props for `<PrismicLink />`.
 */
export type PrismicLinkProps = {
	/**
	 * The Prismic link field or document to render.
	 */
	field: LinkField | PrismicDocument;

	/**
	 * A link resolver function used to resolve links when not using the route
	 * resolver parameter with `@prismicio/client`.
	 *
	 * @defaultValue The link resolver provided to `@prismicio/vue` plugin if configured.
	 *
	 * @see Link resolver documentation {@link https://prismic.io/docs/core-concepts/link-resolver-route-resolver#link-resolver}
	 */
	linkResolver?: LinkResolverFunction;

	/**
	 * An explicit `target` attribute to apply to the rendered link.
	 */
	target?: string | null;

	/**
	 * An explicit `rel` attribute to apply to the rendered link.
	 */
	rel?: string | null;

	/**
	 * Value of the `rel` attribute to use on links rendered with
	 * `target="_blank"`.
	 *
	 * @defaultValue The one provided to `@prismicio/vue` plugin if configured, `"noopener noreferrer"` otherwise.
	 */
	blankTargetRelAttribute?: string | null;

	/**
	 * An HTML tag name, a component, or a functional component used to render
	 * internal links.
	 *
	 * @remarks
	 * HTML tag names will be rendered using the anchor tag interface (`href`,
	 * `target`, and `rel` attributes).
	 * @remarks
	 * Components will be rendered using Vue Router {@link RouterLink} interface
	 * (`to` props).
	 * @defaultValue The one provided to `@prismicio/vue` plugin if configured, {@link RouterLink} otherwise.
	 */
	internalComponent?: string | ConcreteComponent | Raw<DefineComponent>;

	/**
	 * An HTML tag name, a component, or a functional component used to render
	 * external links.
	 *
	 * @remarks
	 * HTML tag names will be rendered using the anchor tag interface (`href`,
	 * `target`, and `rel` attributes).
	 * @remarks
	 * Components will be rendered using Vue Router {@link RouterLink} interface
	 * (`to` props).
	 * @defaultValue The one provided to `@prismicio/vue` plugin if configured, `"a"` otherwise.
	 */
	externalComponent?: string | ConcreteComponent | Raw<DefineComponent>;
};

/**
 * Options for {@link usePrismicLink}.
 */
export type UsePrismicLinkOptions = VueUseOptions<PrismicLinkProps>;

/**
 * Return type of {@link usePrismicLink}.
 */
export type UsePrismicLinkReturnType = {
	/**
	 * Suggested component to render for provided link field.
	 */
	type: ComputedRef<string | ConcreteComponent | Raw<DefineComponent>>;

	/**
	 * Resolved anchor `href` value.
	 */
	href: ComputedRef<string>;

	/**
	 * Resolved anchor `target` value.
	 */
	target: ComputedRef<string | null>;

	/**
	 * Resolved anchor `rel` value.
	 */
	rel: ComputedRef<string | null>;
};

/**
 * A low level composable that returns resolved information about a Prismic link
 * field.
 *
 * @param props - {@link UsePrismicLinkOptions}
 *
 * @returns - Resolved link information {@link UsePrismicLinkReturnType}
 */
export const usePrismicLink = (
	props: UsePrismicLinkOptions,
): UsePrismicLinkReturnType => {
	const { options } = usePrismic();

	const type = computed(() => {
		const internalComponent =
			unref(props.internalComponent) ||
			options.components?.linkInternalComponent ||
			defaultInternalComponent;

		const externalComponent =
			unref(props.externalComponent) ||
			options.components?.linkExternalComponent ||
			defaultExternalComponent;

		return href.value && isInternalURL(href.value) && !target.value
			? internalComponent
			: externalComponent;
	});
	const href = computed(() => {
		const field = unref(props.field);
		const linkResolver = unref(props.linkResolver) ?? options.linkResolver;

		return asLink(field, linkResolver) ?? "";
	});
	const target = computed(() => {
		const field = unref(props.field);
		const target = unref(props.target);

		if (typeof target !== "undefined") {
			return target;
		} else {
			return field && "target" in field && field.target ? field.target : null;
		}
	});
	const rel = computed(() => {
		const rel = unref(props.rel);

		if (typeof rel !== "undefined") {
			return rel;
		} else if (target.value === "_blank") {
			const blankTargetRelAttribute = unref(props.blankTargetRelAttribute);

			if (typeof blankTargetRelAttribute !== "undefined") {
				return blankTargetRelAttribute;
			} else {
				return typeof options.components?.linkBlankTargetRelAttribute !==
					"undefined"
					? options.components.linkBlankTargetRelAttribute
					: defaultBlankTargetRelAttribute;
			}
		} else {
			return null;
		}
	});

	return {
		type,
		href,
		target,
		rel,
	};
};

/**
 * `<PrismicLink />` implementation.
 *
 * @internal
 */
export const PrismicLinkImpl = /*#__PURE__*/ defineComponent({
	name: "PrismicLink",
	props: {
		field: {
			type: Object as PropType<LinkField | PrismicDocument>,
			required: true,
		},
		linkResolver: {
			type: Function as PropType<LinkResolverFunction>,
			default: undefined,
			required: false,
		},
		target: {
			type: String as PropType<string | null>,
			default: undefined,
			required: false,
		},
		rel: {
			type: String as PropType<string | null>,
			default: undefined,
			required: false,
		},
		blankTargetRelAttribute: {
			type: String as PropType<string | null>,
			default: undefined,
			required: false,
		},
		internalComponent: {
			type: [String, Object, Function] as PropType<
				string | ConcreteComponent | Raw<DefineComponent>
			>,
			default: undefined,
			required: false,
		},
		externalComponent: {
			type: [String, Object, Function] as PropType<
				string | ConcreteComponent | Raw<DefineComponent>
			>,
			default: undefined,
			required: false,
		},
	},
	setup(props, { slots }) {
		// Prevent fatal if user didn't check for field, throws `Invalid prop` warn
		if (!props.field) {
			return () => null;
		}

		const { type, href, target, rel } = usePrismicLink(props);

		return () => {
			const parent =
				type.value === "a" ? "a" : simplyResolveComponent(type.value);
			const computedSlots = getSlots(
				parent,
				slots,
				reactive({ href: href.value }),
			);

			if (typeof parent === "string") {
				// Fitting anchor tag interface
				return h(
					parent,
					{ href: href.value, target: target.value, rel: rel.value },
					computedSlots,
				);
			} else {
				// Fitting Vue Router Link interface
				return h(
					parent,
					{ to: href.value, target: target.value, rel: rel.value },
					computedSlots,
				);
			}
		};
	},
});

// export the public type for h/tsx inference
// also to avoid inline import() in generated d.ts files
/**
 * Component to render a Prismic link field.
 *
 * @see Component props {@link PrismicLinkProps}
 * @see Templating link fields {@link https://prismic.io/docs/technologies/vue-template-content#links-and-content-relationships}
 */
export const PrismicLink = PrismicLinkImpl as unknown as {
	new (): {
		$props: AllowedComponentProps &
			ComponentCustomProps &
			VNodeProps &
			PrismicLinkProps;
	};
};
