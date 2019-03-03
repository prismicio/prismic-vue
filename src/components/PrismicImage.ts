import Vue, {ComponentOptions, CreateElement} from 'vue'

export const PrismicImage: ComponentOptions<Vue> = {
  name: 'PrismicImage',
  props: {
    field: {
      required: true
    }
  },
  render(createElement: CreateElement) {
    if (!this.field)
      return null

    const attrs: { [key: string]: string } = {}

    attrs.src = this.field.url

    if (this.field.alt)
      attrs.alt = this.field.alt

    if (this.field.copyright)
      attrs.copyright = this.field.copyright

    return createElement('img', {
      attrs
    })
  }
}
