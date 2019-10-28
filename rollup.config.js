import path from 'path'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import vue from 'rollup-plugin-vue'
import babel from 'rollup-plugin-babel'
import visualizer from 'rollup-plugin-visualizer';
import autoNamedExports from 'rollup-plugin-auto-named-exports';

const globals = {
  'prismic-dom': 'prismicDOM',
  'prismic-javascript': 'prismicJS'
};

const plugins = (visualize = false, resolve = false) => [
  commonjs(),
  vue(),
  babel({
    exclude: 'node_modules/**'
  }),
  ...resolve ? [nodeResolve()] : [],
  autoNamedExports(),
  ...(visualize ? [visualizer({ open: true })] : [])
];

const external = ['prismic-dom', 'prismic-javascript'];

export default function makeConfig(commandOptions) {
  return [{
    external: process.env.BUILD !== 'production' ? [] : external,
    input: 'src/index.js',
    output: [
      {
        file: path.resolve('./dist/prismic-vue.common.js'),
        format: 'cjs'
      },
      {
        file: path.resolve('./dist/prismic-vue.esm.js'),
        globals,
        format: 'es'
      },
      {
        file: path.resolve('./dist/prismic-vue.js'),
        globals,
        format: 'umd',
        name: 'PrismicVue'
      }
    ],
    plugins: plugins(commandOptions['config-visualize'], process.env.BUILD !== 'production')
  }, {
    external,
    input: 'src/components-bundler.js',
    output: [
      {
        file: path.resolve('./components/common.js'),
        format: 'cjs'
      },
      {
        file: path.resolve('./components/index.js'),
        globals,
        format: 'es'
      },
      {
        file: path.resolve('./components/umd.js'),
        globals,
        browser: true,
        format: 'umd',
        name: 'PrismicVueComponents'
      }
    ],
    plugins: plugins(false, process.env.BUILD !== 'production')
  }]
}
