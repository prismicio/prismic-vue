/* tslint:disable */
import path from 'path'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import typescript2 from 'rollup-plugin-typescript2'

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
    babel({
      exclude: 'node_modules/**'
    })
  ]
}
