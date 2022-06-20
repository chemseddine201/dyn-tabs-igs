import {terser} from 'rollup-plugin-terser';
import pkg from './package.json';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
//import babel from 'rollup-plugin-babel';
//import nodeResolve from '@rollup/plugin-node-resolve';
//import replace from '@rollup/plugin-replace';
import nodePolyfills from 'rollup-plugin-node-polyfills';

const getConfig = (en) => ({
  input: pkg.module,
  output: {
    file: en === 'dev' ? 'dist/react-dyn-tabs.umd.js' : 'dist/react-dyn-tabs.umd.min.js',
    format: 'umd',
    name: 'useDynTabs',
    globals: {
      'prop-types': 'PropTypes',
      'react-dom': 'ReactDOM',
      'react': 'React',
    },
    sourcemap: true,
  },
  plugins: [
    /*replace({
        "process.env.NODE_ENV": JSON.stringify("development")
    }),*/
    nodePolyfills(),
    resolve({
        browser: true
    }),
    commonjs({
        include: /node_modules/,
        /*namedExports: {
            'react-is': Object.keys(ReactIs),
            'react': Object.keys(React),
            'react-dom': Object.keys(ReactDOM),
            '@apollo/client': ['ApolloProvider', 'ApolloClient', 'HttpLink', 'InMemoryCache', 'useQuery', 'gql'],
            'styled-components': [ 'styled', 'css', 'ThemeProvider' ]
        }*/
    }),
    /*babel({
        babelrc: true,
        exclude: 'node_modules/**'
    }),*/
    terser()
],
  /*plugins: (function () {
    const _plugins = [nodeResolve({preferBuiltins: false})];
    if (en === 'prod') {
      _plugins.push(terser());
    }
    return _plugins;
  })(),*/
  external: function (id) {
    return /prop-types$|react$|react-dom$|.test.js$|.js.snap$|.css$/g.test(id);
  },
  "peerDependencies": {
    "@babel/runtime-corejs3": "^7.18.3",
    "react": "^18.1.0",
    "react-dom": "^18.1.0",
    "react-sortablejs": "^6.1.4",
    "sortablejs": "^1.15.0"
  },
});
export default [getConfig('dev'), getConfig('prod')];
