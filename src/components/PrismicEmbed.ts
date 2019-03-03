import Vue, {ComponentOptions, CreateElement} from 'vue'

export const PrismicEmbed: ComponentOptions<Vue> = {
  name: 'PrismicEmbed',
  props: {
    field: {
      required: true
    }
  },
  render(createElement: CreateElement) {
    const attrs: { [key: string]: string } = {}

    if (this.field.embed_url)
      attrs['data-oembed'] = this.field.embed_url

    if (this.field.type)
      attrs['data-oembed-type'] = this.field.type

    if (this.field.provider_name)
      attrs['data-oembed-provider'] = this.field.provider_name

    return createElement('div', {
      attrs
    }, [
      this.field.html
    ])
  }
}
