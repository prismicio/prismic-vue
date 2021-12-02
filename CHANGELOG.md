# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [3.0.0-beta.0](https://github.com/prismicio/prismic-vue/compare/v3.0.0-alpha.6...v3.0.0-beta.0) (2021-12-02)


### Bug Fixes

* prop type for `target`, `rel` & `blankTargetRelAttribute` props ([23ba61e](https://github.com/prismicio/prismic-vue/commit/23ba61ef5e68c0eec309e919b90b231425aa4506))


### Chore

* cleanup ignore files ([cee5697](https://github.com/prismicio/prismic-vue/commit/cee5697b5c04ffbcc78f192461f309080627a3a0))
* update release scripts to beta ([0696d2f](https://github.com/prismicio/prismic-vue/commit/0696d2f236367e7ce84b20dcf78221a6599fdd54))

## [3.0.0-alpha.6](https://github.com/prismicio/prismic-vue/compare/v3.0.0-alpha.5...v3.0.0-alpha.6) (2021-11-23)


### Features

* add `resolver` prop to SliceZone for backwards compatibility with `vue-slicezone` ([adf62e2](https://github.com/prismicio/prismic-vue/commit/adf62e242308e87d8fb6c62c31cd36e014613463))


### Chore

* **deps:** fix types after update ([eb82e0e](https://github.com/prismicio/prismic-vue/commit/eb82e0ea845b1f7cd8bf1e484b196d86d9b6bb68))
* key slicezone components for consistency ([d814e1c](https://github.com/prismicio/prismic-vue/commit/d814e1c213fa216a15684f80655dfe450cab3500))


### Refactor

* allow `null` or `""` as truthy value on `<PrismicLink>` ([0bc4f29](https://github.com/prismicio/prismic-vue/commit/0bc4f29ca799fffd73874261456d794aafffdc5a))
* rename `getSliceZoneComponents()` to `defineSliceZoneComponents()` ([17f6736](https://github.com/prismicio/prismic-vue/commit/17f673629a9a3fb04e5236be7d8b9c3c4caca6e6))

## [3.0.0-alpha.5](https://github.com/prismicio/prismic-vue/compare/v3.0.0-alpha.4...v3.0.0-alpha.5) (2021-11-17)


### Bug Fixes

* **deps:** new @prismicio/client types ([293f397](https://github.com/prismicio/prismic-vue/commit/293f39735bdbe4fb7791cecbc879679b80824ccd))


### Documentation

* fix contributing doc link ([8b80a17](https://github.com/prismicio/prismic-vue/commit/8b80a170569a7b41219935381c41678143172de7))


### Chore

* **deps:** maintain dependencies ([eb8a31a](https://github.com/prismicio/prismic-vue/commit/eb8a31a7d0d73b439e4e96088d979d8cd4d06568))

## [3.0.0-alpha.4](https://github.com/prismicio/prismic-vue/compare/v3.0.0-alpha.3...v3.0.0-alpha.4) (2021-09-27)


### Refactor

* simplify internal links handling for <prismic-rich-text /> ([010f714](https://github.com/prismicio/prismic-vue/commit/010f7147ccc8d57b61aa619ad005f3dd99541941))


### Chore

* **deps:** maintain dependencies ([1111f70](https://github.com/prismicio/prismic-vue/commit/1111f701fbc89baf709acf517b5008a10bea70f7))
* **deps:** maintain dependencies ([e4964be](https://github.com/prismicio/prismic-vue/commit/e4964beea33f1ebc083b6a9f1612aaeeee600bcc))
* update template config ([338f1cb](https://github.com/prismicio/prismic-vue/commit/338f1cbe1606be1e3da83d496c2da0357850681d))

## [3.0.0-alpha.3](https://github.com/prismicio/prismic-vue/compare/v3.0.0-alpha.2...v3.0.0-alpha.3) (2021-08-19)


### Chore

* mark component implementations as pue ([1910abf](https://github.com/prismicio/prismic-vue/commit/1910abf3efd90645fd9f547fcb91675fde455614))


### Documentation

* add readme ([3e0bddb](https://github.com/prismicio/prismic-vue/commit/3e0bddb50bed390bb53972a55d57eedf0facc30b))

## [3.0.0-alpha.2](https://github.com/prismicio/prismic-vue/compare/v3.0.0-alpha.1...v3.0.0-alpha.2) (2021-08-19)


### Features

* allow for props hint on getSliceComponentProps ([3245a5c](https://github.com/prismicio/prismic-vue/commit/3245a5c9f0e536ea02cfffe119edc6f6ba33ba23))
* lazy load fetch ponyfill when needed ([bee79c2](https://github.com/prismicio/prismic-vue/commit/bee79c27032cd229063ee78a9ab5fea3d7124514))


### Chore

* **deps:** maintain dependencies ([f7df24d](https://github.com/prismicio/prismic-vue/commit/f7df24dc7661d418b141f2bb9bb7d7c23ec7fdb8))

## [3.0.0-alpha.1](https://github.com/prismicio/prismic-vue/compare/v3.0.0-alpha.0...v3.0.0-alpha.1) (2021-08-17)


### Features

* add basic components and related composables ([eb4e1d6](https://github.com/prismicio/prismic-vue/commit/eb4e1d6f228b685b85f0f087072943e201842412))
* add composables ([a7ab05c](https://github.com/prismicio/prismic-vue/commit/a7ab05c58eda77f104bfc0aad3d50ab4dbd7019c))
* add PrismicLink component ([5f0b4cf](https://github.com/prismicio/prismic-vue/commit/5f0b4cf0a418973b4af6cea5d804436e3ce840e1))
* add slice zone component ([ec0c50a](https://github.com/prismicio/prismic-vue/commit/ec0c50aa76a020898dadcb2303750b799ff601ef))
* navigate internal links using vue-router if present ([0e0de61](https://github.com/prismicio/prismic-vue/commit/0e0de615266e79fdac09fa49bc999697df3f90f3))


### Bug Fixes

* don't use ts ignore comments ([ff5ad93](https://github.com/prismicio/prismic-vue/commit/ff5ad93404a405dbf84d8201867f6d8eaa768aca))
* provide accurate default for usePrismic ([f5a14de](https://github.com/prismicio/prismic-vue/commit/f5a14de4cae2ce7f1c8dcd93bb5b9ad10b63d078))
* use shallowRef to prevent object unnecessary unwrap ([90eb09c](https://github.com/prismicio/prismic-vue/commit/90eb09cc55651d78d15c00f19e3669f5c1d11813))


### Refactor

* composables ([0867de3](https://github.com/prismicio/prismic-vue/commit/0867de34b7c07c5d6144b0cfcfd8d429dd5f7cdb))
* migrate to new typescript template ([804b09d](https://github.com/prismicio/prismic-vue/commit/804b09d20c8eb46ae93b8fb825fa56bfde7b9fdd))
* use computed properties for memo cache ([b642a87](https://github.com/prismicio/prismic-vue/commit/b642a877d5cf04ac119e0b1cb71a7d49761cfa93))
* use dedicated file for plugin and use API ([6c3e944](https://github.com/prismicio/prismic-vue/commit/6c3e9440e6dadb9488586769754b77def789a35b))


### Chore

* add .versionrc ([05392cc](https://github.com/prismicio/prismic-vue/commit/05392cce6f549afdd4d1d6baf5a076e35c7ddf61))
* **config:** add tsdocs lint ([2ff9de7](https://github.com/prismicio/prismic-vue/commit/2ff9de7b401a4cb06ab00af4ac90506556dcc430))
* **deps:** maintain dependencies ([11ddb6b](https://github.com/prismicio/prismic-vue/commit/11ddb6b99be563428062baa5fcda47799096f420))
* fix package lock ([b213b56](https://github.com/prismicio/prismic-vue/commit/b213b56411ddc896b20e8ced4514d95ed89898b5))
* fix package lock ([2b63475](https://github.com/prismicio/prismic-vue/commit/2b63475c4a5e3a6f6f8ab435c26c36b67b3df697))
* maintain dependencies ([9cb8bf9](https://github.com/prismicio/prismic-vue/commit/9cb8bf92952e831fa2dee49322f8d062bc9b5dcc))
* **playground:** update playground ([1641316](https://github.com/prismicio/prismic-vue/commit/1641316499dfd874ecbb3da5de3dd674ddbdc4c1))
* update .github templates ([2b92d7e](https://github.com/prismicio/prismic-vue/commit/2b92d7e8874d8611445747ba9993ed6938a2153c))
* update playground ([782bb20](https://github.com/prismicio/prismic-vue/commit/782bb2054c1e551e81e27fec12795e37937889d8))


### Documentation

* add tsdocs for components ([e2f0bd7](https://github.com/prismicio/prismic-vue/commit/e2f0bd7f800729e46744383d2ed0b2ef4bda8713))
* add tsdocs for composables ([8b8e9f2](https://github.com/prismicio/prismic-vue/commit/8b8e9f2068c6e4e61e598b68cff0e91129153489))
* document root level source files ([26fab78](https://github.com/prismicio/prismic-vue/commit/26fab78a0796a5842aa5c0f0980bcca5a6a62694))
* remove docus doc ([3946e3e](https://github.com/prismicio/prismic-vue/commit/3946e3e4f54bfa95a5335980e7b48a2ccdc7742c))
* tsdocs for plugin types ([18dbbaf](https://github.com/prismicio/prismic-vue/commit/18dbbafc9f988b19380b0721d448ef1ed6328b61))
* typo ([e137db6](https://github.com/prismicio/prismic-vue/commit/e137db6a407d7ea674380f37c3506217c418680f))
* update vetur tags and attributes ([1c927a4](https://github.com/prismicio/prismic-vue/commit/1c927a4c54e83baba0f6ebb29b0f71292f018b07))

## [3.0.0-alpha.0](https://github.com/prismicio/prismic-vue/compare/v2.0.11...v3.0.0-alpha.0) (2021-04-09)


### ⚠ BREAKING CHANGES

* migrate client and dom sdk

### Features

* **components:** add embed component ([d1bab33](https://github.com/prismicio/prismic-vue/commit/d1bab337902cc1299a1c9d3532d24c3ab82ff775))
* **components:** add image component ([0ca4723](https://github.com/prismicio/prismic-vue/commit/0ca4723eb4394393603af4e8fc6f3dcc1f2ae8cf))
* **components:** add link and rich text to vetur definitions ([b790dd4](https://github.com/prismicio/prismic-vue/commit/b790dd44cd80fb697e162693c2fb320768f71c97))
* **components:** add link component ([62efeee](https://github.com/prismicio/prismic-vue/commit/62efeee35a13c5143ba27fd346b3dae788abd4c3))
* **components:** add richtext component & refactor comonents sdk ([155f6c1](https://github.com/prismicio/prismic-vue/commit/155f6c1145e1daa22adec504c87de76bd92a8dc9))
* **core:** export field types ([58b8907](https://github.com/prismicio/prismic-vue/commit/58b89076f371b99c1d543410fa196960e9b5df24))
* **core:** setup vetur ([a8a123e](https://github.com/prismicio/prismic-vue/commit/a8a123e756f2977b73b713a22572ba242c45b865))


### Bug Fixes

* **components:** export image type properly ([5ab0b4b](https://github.com/prismicio/prismic-vue/commit/5ab0b4b85a9eecbb9beca384ea3e6ef749e03b28))
* **core:** worng type on usePrismic ([03b3a23](https://github.com/prismicio/prismic-vue/commit/03b3a23008b4f8febe1fd9f2b582e9e09f3c00e4))
* **dom:** asDate using wrong return value ([6df2abe](https://github.com/prismicio/prismic-vue/commit/6df2abe71019bf05bf979bac5861732c4c770027))
* **sdk:** fix `this` context on dom ([3fbaa4e](https://github.com/prismicio/prismic-vue/commit/3fbaa4e172dad9e25f2f05c40b1b57d19290c8d9))


* migrate client and dom sdk ([cd46806](https://github.com/prismicio/prismic-vue/commit/cd468068c70ce37b86bdbd17fc4dfdf6e08e2a44))
