import path from 'path'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import vue from 'rollup-plugin-vue'
import babel from 'rollup-plugin-babel'

export default {
  input: 'src/index.js',
  output: [
    {
      file: path.resolve('./dist/prismic-vue.common.js'),
      format: 'cjs'
    },
    {
      file: path.resolve('./dist/prismic-vue.esm.js'),
      format: 'es'
    },
    {
      file: path.resolve('./dist/prismic-vue.js'),
      format: 'umd',
      name: 'PrismicVue'
    }
  ],
  plugins: [
    nodeResolve({
      browser: true
    }),
    commonjs(),
    vue(),
    babel({
      exclude: 'node_modules/**'
    })
  ]
}
