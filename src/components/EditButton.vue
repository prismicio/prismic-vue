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
        return null;
      }

      return {
        template: `<div data-wio-id="${this.documentId}"/>`
      };
    }
  },
  watch: {
    documentId () {
      window.PrismicToolbar.setupEditButton();
    }
  }
};
</script>
