<template>
  <component :is="editButtonComponent"/>
</template>

<script>
export default {
  name: 'PrismicEditButton',
  props: {
    documentId: {
      type: String,
      required: true
    }
  },
  computed: {
    editButtonComponent () {
      if (!this.documentId) {
        return null
      }

      return {
        template: `<div data-wio-id="${this.documentId}"/>`
      }
    }
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
</script>
