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

    const domProps: { [key: string]: string } = {}

    domProps.src = this.field.url

    if (this.field.alt)
      domProps.alt = this.field.alt

    if (this.field.copyright)
      domProps.copyright = this.field.copyright

    return createElement('img', {
      domProps
    })
  }
}
