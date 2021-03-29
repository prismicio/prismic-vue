import { defineComponent, h, PropType } from "vue";

interface ImageField {
  url: string;
  alt?: string;
  copyright?: string;
}

export const PrismicImage = defineComponent({
  name: "PrismicImage",
  props: {
    field: {
      type: Object as PropType<ImageField>,
      required: true
    }
  },
  render() {
    const { url: src, alt, copyright } = this.field;

    return h("img", { src, alt, copyright });
  }
});
