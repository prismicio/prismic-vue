export default {
  name: 'PrismicEditButton',
  props: {
    documentId: {
      type: String,
      required: true
    }
  },
  render (h) {
    if (!this.documentId) {
      return h('div')
    }
    const attrs = {}
    if (this.documentId) {
      attrs['data-wio-id'] = this.documentId
    }
    return h('div', { attrs })
  },
  watch: {
    documentId () {
      if (window.PrismicToolbar) {
        window.PrismicToolbar.setupEditButton()
      } else {
        console.error('If you want to add a Prismic Edit Button in your website, you need to have included the Prismic Toolbar script, please read the documentation at https://prismic.io/docs/vuejs/beyond-the-api/in-website-edit-button')
      }
    }
  }
}
