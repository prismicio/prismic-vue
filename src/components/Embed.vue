<template>
  <component :is="embedComponent"/>
</template>

<script>
export default {
  name: 'PrismicEmbed',
  props: {
    field: {
      required: true
    }
  },
  computed: {
    embedComponent () {
      if (!this.field) {
        return null
      }

      const urlAttr = this.field.embed_url ? `data-oembed="${this.field.embed_url}"` : ''
      const typeAttr = this.field.type ? `data-oembed-type="${this.field.type}"` : ''
      const providerNameAttr = this.field.provider_name ? `data-oembed-provider="${this.field.provider_name}"` : ''

      return {
        template: (`
          <div ${urlAttr} ${typeAttr} ${providerNameAttr}>
            ${this.field.html}
          </div>
        `)
      }
    }
  }
}
</script>
