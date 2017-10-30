const debug = process.env.NODE_ENV !== 'production';
require('webpack');
const path = require('path');

module.exports = {
  context: path.join(__dirname, '/public'),
  devtool: debug ? 'source-map' : false,
  // plugins: debug ? [] : [
  //   new webpack.optimize.UglifyJsPlugin(),
  // ],
  entry: './index.ts',
  output: {
    path: path.join(__dirname, '/public/dist'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.css', '.pug', '.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    loaders: [
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.pug$/, use: ['pug-loader'] },
      { test: /\.tsx?$/, use: ['ts-loader'], exclude: /node_modules/ },
    ],
  },
};
