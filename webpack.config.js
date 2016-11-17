const webpack = require('webpack');
const path = require('path');

const ENV = process.env.NODE_ENV || 'development';

console.error(`
  ENV ${ENV}
`);

function getPlugins () {
  let plugins = [
    new webpack.optimize.CommonsChunkPlugin('xin', ENV === 'production' ? 'xin.min.js' : 'xin.js'),
  ];

  if (ENV === 'production') {
    plugins.push(
      new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }),
      new webpack.optimize.DedupePlugin()
    );
  }

  return plugins;
}

module.exports = {
  entry: {
    'xin-analytics': './index.js',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: ENV === 'production' ? '[name].min.js' : '[name].js',
  },
  devtool: 'source-map',
  plugins: getPlugins(),
  module: {
    loaders: [
      {
        test: /\.css$/,
        include: /\/(css|node_modules\/xin)\//,
        loader: [
          require.resolve('style-loader'),
          require.resolve('css-loader'),
        ],
      },
      {
        test: /\.js$/,
        include: /(index\.js|node_modules\/(xin|template-binding)\/)/,
        loader: require.resolve('babel-loader'),
        query: {
          presets: ['es2015', 'stage-3'],
          cacheDirectory: true,
        },
      },
    ],
  },
};
