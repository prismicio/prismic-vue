import Vue, {CreateElement} from 'vue'

export const PrismicEditButton = new Vue({
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
})
