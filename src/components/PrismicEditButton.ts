import Vue, {ComponentOptions, CreateElement, VueConstructor} from 'vue'

export const PrismicEditButton: ComponentOptions<Vue> = {
  name: 'PrismicEditButton',
  props: {
    documentId: {
      type: String,
      required: true
    }
  },
  render(createElement: CreateElement) {
    return createElement('div', {
      domProps: {
        'data-wio-id': this.documentId
      }
    })
  }
}
