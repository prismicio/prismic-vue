import {
	AllowedComponentProps,
	ComponentCustomProps,
	defineComponent,
	h,
	PropType,
	VNodeProps,
	ref,
	unref,
	watch,
	Ref,
	reactive,
	ConcreteComponent,
} from "vue";

import { asLink, LinkResolverFunction } from "@prismicio/helpers";
import { LinkField } from "@prismicio/types";

import { isExternal } from "../lib/isExternal";
import { usePrismic } from "../usePrismic";
import { VueUseOptions } from "../types";
import { simplyResolveComponent } from "../lib/simplyResolveComponent";

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
	internalComponent?: string | ConcreteComponent;
	externalComponent?: string | ConcreteComponent;
};

export type UsePrismicLinkOptions = VueUseOptions<PrismicLinkProps>;

export const usePrismicLink = (
	props: UsePrismicLinkOptions,
): {
	type: Ref<string | ConcreteComponent>;
	href: Ref<string>;
	target: Ref<string | null>;
	rel: Ref<string | null>;
} => {
	const { options } = usePrismic();

	const type = ref<string | ConcreteComponent>(defaultExternalComponent);
	const href = ref<string>("");
	const target = ref<string | null>(null);
	const rel = ref<string | null>(null);

	const resolve = () => {
		const field = unref(props.field);

		const linkResolver = unref(props.linkResolver) ?? options.linkResolver;

		href.value = asLink(unref(props.field), linkResolver) ?? "";

		target.value =
			unref(props.target) ||
			(field && "target" in field && field.target ? field.target : null);

		rel.value =
			unref(props.rel) ||
			(target.value === "_blank" && field && "target" in field && field
				? options.components?.linkBlankTargetRelAttribute ??
				  defaultBlankTargetRelAttribute
				: null);

		const internalComponent =
			unref(props.internalComponent) ??
			options.components?.linkInternalComponent ??
			defaultInternalComponent;

		const externalComponent =
			unref(props.externalComponent) ??
			options.components?.linkExternalComponent ??
			defaultExternalComponent;

		type.value =
			isExternal(href.value) || !href.value
				? externalComponent
				: internalComponent;
	};

	// Watch reactive args
	watch(props, resolve, { deep: true });

	// Resolve once
	resolve();

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
		internalComponent: {
			type: [String, Object] as PropType<string | ConcreteComponent>,
			default: undefined,
			required: false,
		},
		externalComponent: {
			type: [String, Object] as PropType<string | ConcreteComponent>,
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
			switch (type.value) {
				case "a":
					// Fitting anchor tag interface
					return h(
						"a",
						{ href: href.value, target: target.value, rel: rel.value },
						slots.default ? slots.default(reactive({ href: href.value })) : [],
					);

				default:
					// Fitting Vue Router Link interface
					return h(
						simplyResolveComponent(type.value),
						{ to: href.value },
						slots.default ?? [],
					);
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
