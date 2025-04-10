# `<PrismicText>` works only with Rich Text and title fields

`<PrismicText>` works only with [Rich Text and title fields][rich-text-title-field]. It renders the field's value as plain text (i.e. with no formatting, paragraphs, or headings).

```html
<!-- Will render a plain text version of the rich text field's value. -->
<PrismicText :field="doc.data.richTextField" />
```

Other text-based field types, such as [Key Text][key-text-field] and [Select][select-field], cannot be rendered using `<PrismicText>`.

Since Key Text and Select field values are already plain text, you can render them inline without a special component.

```html
<!-- Will render the Key Text field's value. -->
<span>{doc.data.keyTextField}</span>

<!-- Will render the Select field's value. -->
<span>{doc.data.selectField}</span>
```

[rich-text-title-field]: https://prismic.io/docs/rich-text
[key-text-field]: https://prismic.io/docs/field#key-text
[select-field]: https://prismic.io/docs/field#select
