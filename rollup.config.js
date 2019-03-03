/* tslint:disable */
import path from 'path'
import commonjs from 'rollup-plugin-commonjs'
import typescript2 from 'rollup-plugin-typescript2'
import {terser} from 'rollup-plugin-terser'

export default {
  input: 'src/PrismicVue.ts',
  output: [
    {
      file: path.resolve('./dist/PrismicVue.common.js'),
      format: 'cjs'
    },
    {
      file: path.resolve('./dist/PrismicVue.esm.js'),
      format: 'es'
    },
    {
      file: path.resolve('./dist/PrismicVue.js'),
      format: 'umd',
      name: 'PrismicVue'
    }
  ],
  plugins: [
    typescript2(),
    commonjs(),
    terser()
  ]
}
