import {
	AllowedComponentProps,
	ComponentCustomProps,
	defineComponent,
	h,
	PropType,
	VNodeProps,
	unref,
	reactive,
	ConcreteComponent,
	computed,
	ComputedRef,
	FunctionalComponent,
} from "vue";

import { asLink, LinkResolverFunction } from "@prismicio/helpers";
import { LinkField } from "@prismicio/types";

import { isInternalURL } from "../lib/isInternalURL";
import { usePrismic } from "../usePrismic";
import { VueUseOptions } from "../types";
import { simplyResolveComponent } from "../lib/simplyResolveComponent";
import { getSlots } from "../lib/getSlots";

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

export type PrismicLinkProps = {
	field: LinkField;
	linkResolver?: LinkResolverFunction;
	target?: string;
	rel?: string;
	blankTargetRelAttribute?: string;
	internalComponent?: string | ConcreteComponent | FunctionalComponent;
	externalComponent?: string | ConcreteComponent | FunctionalComponent;
};

export type UsePrismicLinkOptions = VueUseOptions<PrismicLinkProps>;

export const usePrismicLink = (
	props: UsePrismicLinkOptions,
): {
	type: ComputedRef<string | ConcreteComponent | FunctionalComponent>;
	href: ComputedRef<string>;
	target: ComputedRef<string | null>;
	rel: ComputedRef<string | null>;
} => {
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
		return (
			asLink(
				unref(props.field),
				unref(props.linkResolver) ?? options.linkResolver,
			) ?? ""
		);
	});
	const target = computed(() => {
		const field = unref(props.field);

		return (
			unref(props.target) ||
			(field && "target" in field && field.target ? field.target : null)
		);
	});
	const rel = computed(() => {
		const field = unref(props.field);

		return (
			unref(props.rel) ||
			(target.value === "_blank" && field && "target" in field && field
				? unref(props.blankTargetRelAttribute) ||
				  options.components?.linkBlankTargetRelAttribute ||
				  defaultBlankTargetRelAttribute
				: null)
		);
	});

	return {
		type,
		href,
		target,
		rel,
	};
};

export const PrismicLinkImpl = defineComponent({
	name: "PrismicLink",
	props: {
		field: {
			type: Object as PropType<LinkField>,
			required: true,
		},
		linkResolver: {
			type: Function as PropType<LinkResolverFunction>,
			default: undefined,
			required: false,
		},
		target: {
			type: String as PropType<string>,
			default: undefined,
			required: false,
		},
		rel: {
			type: String as PropType<string>,
			default: undefined,
			required: false,
		},
		blankTargetRelAttribute: {
			type: String as PropType<string>,
			default: undefined,
			required: false,
		},
		internalComponent: {
			type: [String, Object, Function] as PropType<
				string | ConcreteComponent | FunctionalComponent
			>,
			default: undefined,
			required: false,
		},
		externalComponent: {
			type: [String, Object, Function] as PropType<
				string | ConcreteComponent | FunctionalComponent
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
				return h(parent, { to: href.value }, computedSlots);
			}
		};
	},
});

// export the public type for h/tsx inference
// also to avoid inline import() in generated d.ts files
export const PrismicLink = PrismicLinkImpl as unknown as {
	new (): {
		$props: AllowedComponentProps &
			ComponentCustomProps &
			VNodeProps &
			PrismicLinkProps;
	};
};
