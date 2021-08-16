import {
	AllowedComponentProps,
	ComponentCustomProps,
	computed,
	ConcreteComponent,
	defineComponent,
	h,
	PropType,
	VNodeProps,
} from "vue";

import { ImageField } from "@prismicio/types";

import { usePrismic } from "../usePrismic";
import { simplyResolveComponent } from "../lib/simplyResolveComponent";

/**
 * The default component rendered for images.
 */
const defaultImageComponent = "img";

/**
 * Props for `<PrismicImage />`.
 */
export type PrismicImageProps =
	| {
			/** The Prismic image field to render. */
			field: ImageField;

			/**
			 * Ensures type union is a strict or.
			 *
			 * @internal
			 */
			imageComponent?: never;

			/**
			 * Ensures type union is a strict or.
			 *
			 * @internal
			 */
			imageComponentAdditionalProps?: never;
	  }
	| {
			/** The Prismic image field to render. */
			field: ImageField;

			/**
			 * An HTML tag name, a component, or a functional component used to render images.
			 *
			 * @remarks HTML tag names and components will be rendered using the `img` tag interface (`src` and `alt` attribute). Components will also receive an additional `copyright` props.
			 *
			 * @defaultValue The one provided to `@prismicio/vue` plugin if configured, `"img"` otherwise.
			 */
			imageComponent: string | ConcreteComponent;

			/**
			 * A map of additional props to pass to the component used to render images when using one.
			 */
			imageComponentAdditionalProps?: Record<string, unknown>;
	  };

/**
 * `<PrismicImage />` implementation.
 *
 * @internal
 */
export const PrismicImageImpl = defineComponent({
	name: "PrismicImage",
	props: {
		field: {
			type: Object as PropType<ImageField>,
			required: true,
		},
		imageComponent: {
			type: [String, Object] as PropType<string | ConcreteComponent>,
			default: undefined,
			required: false,
		},
		imageComponentAdditionalProps: {
			type: Object as PropType<Record<string, unknown>>,
			default: undefined,
			required: false,
		},
	},
	setup(props) {
		// Prevent fatal if user didn't check for field, throws `Invalid prop` warn
		if (!props.field) {
			return () => null;
		}

		const { options } = usePrismic();

		const type = computed(() => {
			return (
				props.imageComponent ||
				options.components?.imageComponent ||
				defaultImageComponent
			);
		});

		return () => {
			const attributes = {
				src: props.field.url || null,
				alt: props.field.alt || null,
			};

			switch (type.value) {
				case "img":
					// Fitting img tag interface
					return h("img", attributes);

				default:
					return h(simplyResolveComponent(type.value), {
						...attributes,
						copyright: props.field.copyright || null,
						...props.imageComponentAdditionalProps,
					});
			}
		};
	},
});

// export the public type for h/tsx inference
// also to avoid inline import() in generated d.ts files
/**
 * Component to render a Prismic image field.
 *
 * @see Component props {@link PrismicImageProps}
 * @see Templating image fields {@link https://prismic.io/docs/technologies/vue-template-content#images}
 */
export const PrismicImage = PrismicImageImpl as unknown as {
	new (): {
		$props: AllowedComponentProps &
			ComponentCustomProps &
			VNodeProps &
			PrismicImageProps;
	};
};
