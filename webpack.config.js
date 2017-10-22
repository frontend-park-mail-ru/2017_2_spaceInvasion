const debug = process.env.NODE_ENV !== 'production';
require('webpack');
const path = require('path');

module.exports = {
  context: path.join(__dirname, '/public'),
  devtool: debug ? 'source-map' : null,
  entry: './index.js',
  output: {
    path: path.join(__dirname, '/public/dist'),
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.pug$/, use: ['pug-loader'] },
    ],
  },
};
