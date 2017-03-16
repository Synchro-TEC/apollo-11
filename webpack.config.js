const webpack = require('webpack');
var CompressionPlugin = require('compression-webpack-plugin');
// var CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require('path');

const ENV = process.env.NODE_ENV || 'development';

var VERSION = JSON.stringify(require('./package.json').version).replace(/["']/g, '');

module.exports = env => {

  console.log(`|******************* NODE_ENV: ${ENV.toUpperCase()} #### VERSION: ${VERSION} ***********************************|`);

  const addPlugin = (add, plugin) => add ? plugin : undefined;
  const ifProd = plugin => addPlugin(env.prod, plugin);
  const removeEmpty = array => array.filter(i => !!i);
  return {
    entry: {
      index: './src/index.js',
    },
    output: {
      path: path.join(__dirname, 'lib'),
      filename: 'index.js',
      publicPath: '/lib/',
      library: 'apollo-11',
      libraryTarget: 'umd'
    },
    externals: {
      react: {
        root: 'React',
        commonjs: 'react',
        commonjs2: 'react',
        amd: 'react',
      },
      'react-dom': {
        root: 'ReactDOM',
        commonjs: 'react-dom',
        commonjs2: 'react-dom',
        amd: 'react-dom',
      },
    },
    // context: resolve(__dirname, 'src'),
    devtool: env.prod ? 'source-map' : 'eval',
    bail: env.prod,
    module: {
      loaders: [
        {
          test: /\.js$|\.jsx$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          query: {
            plugins: ['transform-decorators-legacy'],
            presets: ['es2015', 'stage-0', 'react']},
        },
        { test: /\.css$/,  loader: 'style-loader!css' },
      ],
    },
    plugins: removeEmpty([
      // new CopyWebpackPlugin([
      //   { from: './src/PowerTable/data-collection.js', to:  './lib/PowerTable/data-collection.js'}
      // ]),
      ifProd(new webpack.optimize.DedupePlugin()),
      ifProd(new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false,
        quiet: true,
      })),
      ifProd(new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"production"',
        },
      })),
      ifProd(new webpack.optimize.UglifyJsPlugin({
        compress: {
          screw_ie8: true, // eslint-disable-line
          warnings: false,
        },
      })),
      ifProd(new CompressionPlugin({
        asset: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.js$|\.css$/,
        threshold: 10240,
        minRatio: 0.8,
      })),
    ]),
  };
};
