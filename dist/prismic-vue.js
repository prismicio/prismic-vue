(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('prismic-dom'), require('prismic-javascript')) :
  typeof define === 'function' && define.amd ? define(['prismic-dom', 'prismic-javascript'], factory) :
  (global.PrismicVue = factory(global.prismicDOM,global.prismicJS));
}(this, (function (prismicDOM,prismicJS) { 'use strict';

  var prismicDOM__default = 'default' in prismicDOM ? prismicDOM['default'] : prismicDOM;
  prismicJS = prismicJS && prismicJS.hasOwnProperty('default') ? prismicJS['default'] : prismicJS;

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(source, true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(source).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
      return;
    }

    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  var Embed = {
    name: 'PrismicEmbed',
    functional: true,
    props: {
      field: {
        type: Object,
        required: true
      },
      wrapper: {
        type: String,
        required: false,
        "default": 'div'
      }
    },
    render: function render(h, _ref) {
      var props = _ref.props,
          data = _ref.data;
      var field = props.field,
          wrapper = props.wrapper;

      if (!field || !field.html) {
        return null;
      }

      var embedUrl = field.embed_url,
          type = field.type,
          providerName = field.provider_name;

      var attrs = _objectSpread2({}, data.attrs, {}, embedUrl && {
        'data-oembed': embedUrl
      }, {}, type && {
        'data-oembed-type': type
      }, {}, providerName && {
        'data-oembed-provider': providerName
      });

      return h(wrapper, _objectSpread2({}, Object.assign(data, {
        staticClass: undefined,
        "class": [data["class"], data.staticClass]
      }), {
        attrs: attrs,
        domProps: {
          innerHTML: field.html
        }
      }));
    }
  };

  var Image = {
    name: 'PrismicImage',
    functional: true,
    props: {
      field: {
        type: Object,
        required: true
      }
    },
    render: function render(h, _ref) {
      var props = _ref.props,
          data = _ref.data;
      var _props$field = props.field,
          url = _props$field.url,
          alt = _props$field.alt,
          copyright = _props$field.copyright; // See https://vuejs.org/v2/guide/render-function.html#Functional-Components

      data.attrs = data.attrs || {};
      data.attrs.src = url;

      if (alt) {
        data.attrs.alt = alt;
      }

      if (copyright) {
        data.attrs.copyright = copyright;
      }

      return h('img', data);
    }
  };

  var Link = (function () {
    var linkComponent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'router-link';
    return {
      name: 'PrismicLink',
      functional: true,
      props: {
        field: {
          type: Object,
          required: true
        }
      },
      render: function render(h, _ref) {
        var props = _ref.props,
            data = _ref.data,
            children = _ref.children,
            parent = _ref.parent;
        var field = props.field;

        if (!field) {
          return null;
        } // Is this check enough to make Link work with Vue-router and Nuxt?


        var url = linkComponent === 'nuxt-link' ? parent.$prismic.asLink(field) : prismicDOM__default.Link.url(field, parent.$prismic.linkResolver); // Internal link

        if (['Link.Document', 'Document'].includes(field.link_type)) {
          data.props = data.props || {};
          data.props.to = url;
          return h(linkComponent, data, children);
        }

        data.attrs = _objectSpread2({}, data.attrs, {
          href: url
        }, field.target && {
          target: field.target,
          rel: 'noopener'
        });
        return h('a', data, children);
      }
    };
  });

  var RichText = {
    name: 'PrismicRichText',
    functional: true,
    props: {
      field: {
        type: Array,
        required: true
      },
      htmlSerializer: {
        type: Function,
        required: false
      },
      wrapper: {
        type: String,
        required: false,
        "default": 'div'
      }
    },
    render: function render(h, _ref) {
      var props = _ref.props,
          data = _ref.data,
          children = _ref.children,
          parent = _ref.parent;
      var field = props.field,
          htmlSerializer = props.htmlSerializer,
          wrapper = props.wrapper;
      var innerHTML = prismicDOM.RichText.asHtml(field, parent.$prismic.linkResolver, htmlSerializer || parent.$prismic.htmlSerializer);
      return h(wrapper, _objectSpread2({}, data, {
        domProps: {
          innerHTML: innerHTML
        }
      }));
    }
  };

  var NuxtLink = Link('nuxt-link', 'PrismicNuxtLink');
  var VueRouterLink = Link();
  var exp = {
    common: {
      Embed: Embed,
      Image: Image,
      RichText: RichText
    },
    nuxt: {
      Link: NuxtLink
    },
    vueRouter: {
      Link: VueRouterLink
    }
  };

  var PrismicVue = {
    install: function install(Vue, options) {
      var _options$linkType = options.linkType,
          linkType = _options$linkType === void 0 ? 'vueRouter' : _options$linkType;
      Vue.prototype.$prismic = prismicJS;
      Vue.prototype.$prismic.endpoint = options.endpoint;
      Vue.prototype.$prismic.linkResolver = options.linkResolver;
      Vue.prototype.$prismic.htmlSerializer = options.htmlSerializer;
      Vue.prototype.$prismic.client = prismicJS.client(options.endpoint, options.apiOptions);

      Vue.prototype.$prismic.richTextAsPlain = function (field) {
        if (!field) {
          return '';
        }

        return prismicDOM__default.RichText.asText(field);
      };

      var components = _objectSpread2({}, exp.common, {}, exp[linkType]);
      /**
       * Global registration of common components + stack specific components.
       * Currently, only Nuxt links differ though. Use `linkType: 'nuxt'` in that case.
       */


      Object.entries(components).forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            _ = _ref2[0],
            c = _ref2[1];

        Vue.component(c.name, c);
      });
    }
  };

  return PrismicVue;

})));
