<template>
  <component :is="linkComponent">
    <slot/>
  </component>
</template>

<script>
import prismicDOM from 'prismic-dom'

export default {
  name: 'PrismicLink',
  props: {
    field: {
      required: true
    }
  },
  computed: {
    linkComponent () {
      if (!this.field) {
        return null
      }

      let template = ''
      const url = prismicDOM.Link.url(this.field, this.$prismic.linkResolver)

      if (this.field.link_type === 'Document') {
        template = (`
          <router-link to="${url}">
            <slot/>
          </router-link>
        `)
      } else {
        const target = this.field.target ? `target="'${this.field.target}'" rel="noopener"` : ''

        template = (`
          <a href="${url}" ${target}>
            <slot/>
          </a>
        `)
      }
      return { template }
    }
  }
}
</script>
