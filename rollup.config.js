import babel from 'rollup-plugin-babel';
import cleanup from 'rollup-plugin-cleanup';
import commonjs from 'rollup-plugin-commonjs';
import flow from 'rollup-plugin-flow';
import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';

import packageJSON from './package.json';

const deps = [
  ...Object.keys(packageJSON.peerDependencies),
  ...Object.keys(packageJSON.dependencies),
];

const external = id => deps.includes(id);

const plugins = () => [
  replace({
    'process.env.NODE_ENV': JSON.stringify('production'),
  }),
  flow(),
  babel({
    exclude: 'node_modules/**',
  }),
  resolve(),
  commonjs(),
  cleanup(),
];

export default [
  {
    input: 'src/index.js',
    external,
    output: [
      { file: packageJSON.main, format: 'cjs' },
      { file: packageJSON.module, format: 'es' },
    ],
    plugins: plugins(),
  },
];
