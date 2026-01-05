<!--

Replace all on all files (README.md, CONTRIBUTING.md, bug_report.md, package.json):
- @prismicio/vue
- Vue plugin, components, and composables to fetch and present Prismic content
- prismicio/prismic-vue
- prismic-vue

-->

# @prismicio/vue

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]

<!-- Replacing link to Prismic with [Prismic][prismic] is useful here -->

[Vue][vue-docs] plugin, components, and composables to fetch and present [Prismic][prismic] content.

- 📝 &nbsp;Display content from Prismic like [rich text][prismic-rich-text] and [link][prismic-link] fields.
- 🍡 &nbsp;Render Prismic [slice zones][prismic-slices] declaratively with Vue components.
- 🎣 &nbsp;Fetch Prismic content throughout your Vue application.

## Install

```bash
npm install @prismicio/vue
```

## Documentation

To discover what's new on this package check out [the changelog][changelog]. For full documentation, visit the [official Prismic documentation][prismic-docs].

## Contributing

Whether you're helping us fix bugs, improve the docs, or spread the word, we'd love to have you as part of the Prismic developer community!

**Asking a question**: [Open a new topic][forum-question] on our community forum explaining what you want to achieve / your question. Our support team will get back to you shortly.

**Reporting a bug**: [Open an issue][repo-bug-report] explaining your application's setup and the bug you're encountering.

**Suggesting an improvement**: [Open an issue][repo-feature-request] explaining your improvement or feature so we can discuss and learn more.

**Submitting code changes**: For small fixes, feel free to [open a pull request][repo-pull-requests] with a description of your changes. For large changes, please first [open an issue][repo-feature-request] so we can discuss if and how the changes should be implemented.

For more clarity on this project and its structure you can also check out the detailed [CONTRIBUTING.md][contributing] document.

## License

```
   Copyright 2013-2025 Prismic <contact@prismic.io> (https://prismic.io)

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
```

<!-- Links -->

[prismic]: https://prismic.io

<!-- Replace link with a more useful one if available -->

[prismic-docs]: https://prismic.io/docs/technical-reference/prismicio-vue/v5
[vue-docs]: https://vuejs.org
[changelog]: ./CHANGELOG.md
[contributing]: ./CONTRIBUTING.md
[prismic-rich-text]: https://prismic.io/docs/fields/rich-text
[prismic-link]: https://prismic.io/docs/fields/link
[prismic-slices]: https://prismic.io/docs/slices

<!-- Replace link with a more useful one if available -->

[forum-question]: https://community.prismic.io
[repo-bug-report]: https://github.com/prismicio/prismic-vue/issues/new?assignees=&labels=bug&template=bug_report.md&title=
[repo-feature-request]: https://github.com/prismicio/prismic-vue/issues/new?assignees=&labels=enhancement&template=feature_request.md&title=
[repo-pull-requests]: https://github.com/prismicio/prismic-vue/pulls

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@prismicio/vue/latest.svg
[npm-version-href]: https://npmjs.com/package/@prismicio/vue
[npm-downloads-src]: https://img.shields.io/npm/dm/@prismicio/vue.svg
[npm-downloads-href]: https://npmjs.com/package/@prismicio/vue
