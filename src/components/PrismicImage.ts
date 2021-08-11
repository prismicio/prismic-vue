import {
	AllowedComponentProps,
	ComponentCustomProps,
	computed,
	ConcreteComponent,
	defineComponent,
	FunctionalComponent,
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

export type PrismicImageProps =
	| {
			field: ImageField;
	  }
	| {
			field: ImageField;
			imageComponent: string | ConcreteComponent | FunctionalComponent;
			imageComponentAdditionalProps?: Record<string, unknown>;
	  };

export const PrismicImageImpl = defineComponent({
	name: "PrismicImage",
	props: {
		field: {
			type: Object as PropType<ImageField>,
			required: true,
		},
		imageComponent: {
			type: [String, Object] as PropType<
				string | ConcreteComponent | FunctionalComponent
			>,
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
				copyright: props.field.copyright || null,
			};

			switch (type.value) {
				case "img":
					// Fitting img tag interface
					return h("img", attributes);

				default:
					return h(simplyResolveComponent(type.value), {
						...attributes,
						...props.imageComponentAdditionalProps,
					});
			}
		};
	},
});

// export the public type for h/tsx inference
// also to avoid inline import() in generated d.ts files
export const PrismicImage = PrismicImageImpl as unknown as {
	new (): {
		$props: AllowedComponentProps &
			ComponentCustomProps &
			VNodeProps &
			PrismicImageProps;
	};
};
