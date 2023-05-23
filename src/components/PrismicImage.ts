import {
	ImageField,
	asImagePixelDensitySrcSet,
	asImageSrc,
	asImageWidthSrcSet,
	isFilled,
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
	unref,
} from "vue";

import { __PRODUCTION__ } from "../lib/__PRODUCTION__";
import { simplyResolveComponent } from "../lib/simplyResolveComponent";

import { VueUseOptions } from "../types";

import { usePrismic } from "../usePrismic";

/**
 * The default component rendered for images.
 */
const defaultImageComponent = "img";

/**
 * Props for `<PrismicImage />`.
 */
export type PrismicImageProps = {
	/**
	 * The Prismic image field to render.
	 */
	field: ImageField | ImageField<string>;

	/**
	 * An HTML tag name, a component, or a functional component used to render
	 * images.
	 *
	 * @remarks
	 * HTML tag names and components will be rendered using the `img` tag
	 * interface (`src`, `srcset`, and `alt` attribute). Components will also
	 * receive an additional `copyright` props.
	 * @defaultValue The one provided to `@prismicio/vue` plugin if configured, `"img"` otherwise.
	 */
	imageComponent?: string | ConcreteComponent | Raw<DefineComponent>;

	/**
	 * An object of Imgix URL API parameters.
	 *
	 * @see Imgix URL parameters reference: https://docs.imgix.com/apis/rendering
	 */
	imgixParams?: Parameters<typeof asImageSrc>[1];

	/**
	 * Adds an additional `srcset` attribute to the image following given widths.
	 *
	 * @remarks
	 * A special value of `"thumbnails"` is accepted to automatically use image
	 * widths coming from the API.
	 * @remarks
	 * A special value of `"defaults"` is accepted to automatically use image
	 * widths coming from the plugin configuration.
	 * @remarks
	 * This prop is not compatible with the `pixelDensities` prop. When both are
	 * used the `pixelDensities` prop will be ignored.
	 */
	widths?:
		| NonNullable<Parameters<typeof asImageWidthSrcSet>[1]>["widths"]
		| "thumbnails"
		| "defaults";

	/**
	 * Adds an additional `srcset` attribute to the image following giving pixel
	 * densities.
	 *
	 * @remarks
	 * A special value of `"defaults"` is accepted to automatically use image
	 * pixel densities coming from the plugin configuration.
	 * @remarks
	 * This prop is not compatible with the `widths` prop. When both are used, the
	 * `pixelDensities` prop will be ignored.
	 */
	pixelDensities?:
		| NonNullable<
				Parameters<typeof asImagePixelDensitySrcSet>[1]
		  >["pixelDensities"]
		| "defaults";
};

/**
 * Options for {@link usePrismicImage}.
 */
export type UsePrismicImageOptions = VueUseOptions<
	Omit<PrismicImageProps, "imageComponent">
>;

/**
 * Return type of {@link usePrismicImage}.
 */
export type UsePrismicImageReturnType = {
	/**
	 * Resolved image `src` value.
	 */
	src: ComputedRef<string | null>;

	/**
	 * Resolved image `srcset` value.
	 */
	srcset: ComputedRef<string | null>;

	/**
	 * Resolved image `alt` value.
	 */
	alt: ComputedRef<string>;

	/**
	 * Resolved image `copyright` value.
	 */
	copyright: ComputedRef<string | null>;
};

/**
 * A low level composable that returns a resolved information about a Prismic
 * image field.
 *
 * @param props - {@link UsePrismicImageOptions}
 *
 * @returns - Resolved image information {@link UsePrismicImageReturnType}
 */
export const usePrismicImage = (
	props: UsePrismicImageOptions,
): UsePrismicImageReturnType => {
	const { options } = usePrismic();

	const asImage = computed(() => {
		const field = unref(props.field);

		if (!isFilled.image(field)) {
			return {
				src: null,
				srcset: null,
			};
		}

		const imgixParams = unref(props.imgixParams);
		const widths = unref(props.widths);
		const pixelDensities = unref(props.pixelDensities);

		if (widths) {
			if (!__PRODUCTION__ && pixelDensities) {
				console.warn(
					"[PrismicImage] Only one of `widths` or `pixelDensities` props can be provided. You can resolve this warning by removing either the `widths` or `pixelDensities` prop. `widths` will be used in this case.",
					props,
				);
			}

			return asImageWidthSrcSet(field, {
				...imgixParams,
				widths:
					widths === "defaults"
						? options.components?.imageWidthSrcSetDefaults
						: widths,
			});
		} else if (pixelDensities) {
			return asImagePixelDensitySrcSet(field, {
				...imgixParams,
				pixelDensities:
					pixelDensities === "defaults"
						? options.components?.imagePixelDensitySrcSetDefaults
						: pixelDensities,
			});
		} else {
			return {
				src: asImageSrc(field, imgixParams),
				srcset: null,
			};
		}
	});

	const src = computed(() => {
		return asImage.value.src;
	});
	const srcset = computed(() => {
		return asImage.value.srcset;
	});
	const alt = computed(() => {
		return unref(props.field).alt || "";
	});
	const copyright = computed(() => {
		return unref(props.field).copyright || null;
	});

	return {
		src,
		srcset,
		alt,
		copyright,
	};
};

/**
 * `<PrismicImage />` implementation.
 *
 * @internal
 */
export const PrismicImageImpl = /*#__PURE__*/ defineComponent({
	name: "PrismicImage",
	props: {
		field: {
			type: Object as PropType<ImageField | ImageField<string>>,
			required: true,
		},
		imageComponent: {
			type: [String, Object] as PropType<
				string | ConcreteComponent | Raw<DefineComponent>
			>,
			default: undefined,
			required: false,
		},
		imgixParams: {
			type: Object as PropType<Parameters<typeof asImageSrc>[1]>,
			default: undefined,
			required: false,
		},
		widths: {
			type: [String, Object] as PropType<
				| NonNullable<Parameters<typeof asImageWidthSrcSet>[1]>["widths"]
				| "thumbnails"
				| "defaults"
			>,
			default: undefined,
			required: false,
		},
		pixelDensities: {
			type: [String, Object] as PropType<
				| NonNullable<
						Parameters<typeof asImagePixelDensitySrcSet>[1]
				  >["pixelDensities"]
				| "defaults"
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

		const { options } = usePrismic();

		const type = computed(() => {
			return (
				props.imageComponent ||
				options.components?.imageComponent ||
				defaultImageComponent
			);
		});

		const { src, srcset, alt, copyright } = usePrismicImage(props);

		return () => {
			const attributes = {
				src: src.value,
				srcset: srcset.value,
				alt: alt.value,
			};

			switch (type.value) {
				case "img":
					// Fitting img tag interface
					return h("img", attributes);

				default:
					return h(simplyResolveComponent(type.value), {
						...attributes,
						copyright: copyright.value,
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
