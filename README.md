![alt text](https://prismic.io/...1b58998/images/logo-dark.svg)

[![npm version](https://badge.fury.io/js/prismic-vue.svg)](http://badge.fury.io/js/prismic-vue)

# prismic-vue V₂

> Vue.js plugin to facilitate integration of content managed with [Prismic.io](https://prismic.io).
Looking for a Nuxt solution? Here you go 👉 [prismic-nuxt plugin](https://github.com/jamespegg/prismic-nuxt)

# Install

`prismic-vue` relies on `prismic-javascript` and `prismic-dom`.
If you are migrating from V1, make sure to install them too as they are now peer dependencies.
``` bash
npm install prismic-vue prismic-javascript prismic-dom
```
👉 quick note: prismic-javascript is a library responsible for _making requests to your Prismic endpoint_,
while prismic-dom is responsible for serializing html from RichText ([RichText you said?](https://user-guides.prismic.io/en/articles/383762-rich-text)).

# What it does

This package serves two purposes and can acutally but split into two different parts.

#### 1- Queries
The first purpose of `prismic-vue` is to offer an easy way to fetch your Prismic content. When registering `PrismicVue`, we directly inject a `prismic-javascript` instance, to be used anywhere in your Vue project.

``` javascript
import prismicJS from 'prismic-js';

const PrismicVue = {
  install: function (Vue, options) {
    Vue.prototype.$prismic = prismicJS
    Vue.prototype.$prismic.endpoint = options.endpoint
    Vue.prototype.$prismic.linkResolver = options.linkResolver
    Vue.prototype.$prismic.htmlSerializer = options.htmlSerializer
    ...
  }
}
```

### 2 - Components

The second purpose of `prismic-vue` is to globally register components that will help you _display content queried via your Prismic API_. Their purpose is (mostly) to serialize Prismic data into html. These components being used in other libraries (like `prismic-nuxt`), note that you can actually import them without registering `PrismicVue`.


# Usage

This [getting started guide](https://prismic.io/docs/vuejs/getting-started/integrating-with-existing-project) should be of great help to kickstart your first Prismic/Vue project.
In case you're more into markdown, you can alternatevely keep reading ☺️

### 1/Register PrismicVue
First, you should register the plugin:
```javascript
import PrismicVue from 'prismic-vue'

Vue.use(PrismicVue, {
  endpoint: 'https://your-api-endpoint.prismic.io/api/v2',
  linkResolver: function(doc) {
    if (doc.type === 'home') {
        return '/';
    }
  },
});
```

When registering the plugin, you may pass these options. Although `linkResolver` and `htmlSerializer` are not required, they are usually pretty useful. Make sure to check them out! ✌️


| Option name    	| Type     	| Required 	| Default value 	| Description                                                                                                          	|
|----------------	|----------	|----------	|---------------	|----------------------------------------------------------------------------------------------------------------------	|
| endpoint       	| string   	| yes      	| none          	| Your Prismic api endpoint                                                                                            	|
| linkResolver   	| function 	| no       	| none          	| See [Link Resolving in Javascript](https://prismic.io/docs/javascript/beyond-the-api/link-resolving)                 	|
| htmlSerializer 	| function 	| no       	| none          	| See [html Serializer documentation](https://prismic.io/docs/javascript/beyond-the-api/html-serializer)               	|
| linkType       	| string   	| no       	| vueRouter     	| Link components may be handled differently based on what you use. Currently accepted values: 'vueRouter' and 'nuxt'. 	|

### 2/Query your content
Because we inject a `prismic-javascript` instance into Vue, each of its method are accessible from your components. Make sure to check [its documentation](https://github.com/prismicio/prismic-javascript)!

A bare bone example that fetches data from a `home` document and then sets a `fields` data object:
```javascript
export default {
  name: 'MyComponent',
  data: {
    fields: {
      title: null,
      logo: null,
      somethingRich: null
    }
  },
  methods: {
    getContent () {
      this.$prismic.client.getSingle('home')
        .then((document) => {
          this.fields = document.data
        })
    }
  },
  created () {
    this.getContent();
  }
}
```

### 3/use components
Following the example above, let's write the associated template:

```html
<template>
  <section>
    <primsic-image :field="fields.logo" />
    <prismic-rich-text :field="fields.title" />
    <prismic-rich-text :field="fields.somethingRich" />
  </section>
</template>
```

👆 If you were to log `document.data` in our previous query, you would notice that `title` and `somethingRich` are actually arrays instead of strings. This is because Prismic provides content writers with a WYSIWYG editor. It's awesome for formatting text but harder to deal with on client side. Fortunately, `prismic-rich-text` is a component made to deal with this format.

Obviously, `prismic-image` works the same way on image fields, stored in your Prismic API.

# List of components

List of available components and use cases:


| Component         	| Prismic type      	| Use case                                                         	| Example use                                                                                         	|
|-------------------	|-------------------	|------------------------------------------------------------------	|-----------------------------------------------------------------------------------------------------	|
| prismic-rich-text 	| Rich Text, Title 	| Used when you need formatting fir text (bold, italic, embeds...) 	| `<prismic-rich-text :field="field.description" wrapper="div" :htmlSerializer="myLocalSerializer"/>` 	|
| prismic-link      	| Link              	| Used to resolve links stored in your Prismic content.            	| `<prismic-link :field="menuLink.link">My link</prismic-link>`                                       	|
| prismic-image     	| Image             	| Used to display images stored in Prismic.                        	| `<prismic-image :field="fields.logo" />`                                                            	|
| prismic-embed     	| Embed             	| Used to display embeds stored in Prismic.                        	| `<prismic-embed :field="fields.embed" wrapper="div" />`                                             	|

👆 Make sure to have a look at their source code: it is quite short, does simple things and might help you understand how we convert a Prismic API response into something that can actually be committed to the DOM.

# Integrate prismic-vue components

If you are working on a `prismic-vue` integration (like Nuxt does for example), you might find the need to use the components, without using the actual `PrismicVue` plugin. We've got you covered:

```javascript
import { common, vueRouter, nuxt } 'prismic-vue/components';

console.log(common) // { Embed, Image, RichText ...}
console.log(nuxt) // { Link }
// etc.

Vue.prototype.$prismic = {
  // because some components
  // require a link resolver
  linkResolver() { /* ... */}
}

// Register common components
Object.entries(common).forEach(([_, component]) => {
    Vue.component(component.name, component)
})
```

Thanks for reading 👋

---

## License

This software is licensed under the Apache 2 license, quoted below.

Copyright 2013-2020 Prismic (http://prismic.io).

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this project except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
