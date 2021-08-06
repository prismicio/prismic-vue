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

import { asText } from "@prismicio/helpers";
import { RichTextField } from "@prismicio/types";

import { VueUseOptions } from "../types";
import { simplyResolveComponent } from "../lib/simplyResolveComponent";

/**
 * The default component rendered to wrap the text output.
 */
const defaultWrapper = "p";

export type PrismicTextProps = {
	field: RichTextField;
	separator?: string;
	wrapper?: string | ConcreteComponent;
};

export type UsePrismicTextOptions = VueUseOptions<
	Omit<PrismicTextProps, "wrapper">
>;

export const usePrismicText = (
	props: UsePrismicTextOptions,
): { text: ComputedRef<string> } => {
	const text = computed(() => {
		return asText(unref(props.field), unref(props.separator));
	});

	return {
		text,
	};
};

export const PrismicTextImpl = defineComponent({
	name: "PrismicText",
	props: {
		field: {
			type: Array as PropType<RichTextField>,
			required: true,
		},
		separator: {
			type: String as PropType<string>,
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

		const { text } = usePrismicText(props);

		return () => {
			return h(simplyResolveComponent(props.wrapper || defaultWrapper), {}, [
				text.value,
			]);
		};
	},
});

// export the public type for h/tsx inference
// also to avoid inline import() in generated d.ts files
export const PrismicText = PrismicTextImpl as unknown as {
	new (): {
		$props: AllowedComponentProps &
			ComponentCustomProps &
			VNodeProps &
			PrismicTextProps;
	};
};
