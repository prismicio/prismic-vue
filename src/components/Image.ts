import {
  AllowedComponentProps,
  ComponentCustomProps,
  defineComponent,
  h,
  PropType,
  VNodeProps
} from "vue";
import { ImageField } from "../types";

interface PrismicImageProps {
  field: ImageField;
}

export const PrismicImageImpl = defineComponent({
  name: "PrismicImage",
  props: {
    field: {
      type: Object as PropType<ImageField>,
      required: true
    }
  },
  render() {
    if (!this.field) {
      return null;
    }

    const { url: src, alt, copyright } = this.field;

    return h("img", { src, alt, copyright });
  }
});

// export the public type for h/tsx inference
// also to avoid inline import() in generated d.ts files
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PrismicImage = (PrismicImageImpl as any) as {
  new (): {
    $props: AllowedComponentProps &
      ComponentCustomProps &
      VNodeProps &
      PrismicImageProps;
  };
};
