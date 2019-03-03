import Vue, {ComponentOptions, CreateElement} from 'vue'

export const PrismicEmbed: ComponentOptions<Vue> = {
  name: 'PrismicEmbed',
  props: {
    field: {
      required: true
    }
  },
  render(createElement: CreateElement) {
    const domProps: { [key: string]: string } = {}

    if (this.field.embed_url)
      domProps['data-oembed'] = this.field.embed_url

    if (this.field.type)
      domProps['data-oembed-type'] = this.field.type

    if (this.field.provider_name)
      domProps['data-oembed-provider'] = this.field.provider_name

    return createElement('div', {
      domProps
    }, [
      this.field.html
    ])
  }
}
