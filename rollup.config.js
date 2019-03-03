/* tslint:disable */
import path from 'path'
import commonjs from 'rollup-plugin-commonjs'
import vue from 'rollup-plugin-vue'
import babel from 'rollup-plugin-babel'
import typescript2 from 'rollup-plugin-typescript2'

export default {
  input: 'src/PrismicVue.ts',
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
    typescript2(),
    commonjs(),
    vue(),
    babel({
      exclude: 'node_modules/**'
    })
  ]
}
