<template>
  <component :is="imageComponent"/>
</template>

<script>
export default {
  name: 'PrismicImage',
  props: {
    field: {
      required: true
    }
  },
  computed: {
    imageComponent () {
      if (!this.field) {
        return null
      }

      const altAttr = this.field.alt ? `alt="${this.field.alt}"` : ''
      const copyrightAttr = this.field.copyright ? `copyright="${this.field.copyright}"` : ''

      return {
        template: `<img src="${this.field.url}" ${altAttr} ${copyrightAttr}>`
      }
    }
  }
}
</script>
