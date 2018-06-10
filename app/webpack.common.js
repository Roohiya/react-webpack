const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

// create 'absolute' paths for dist, src and data files
const pathBuild = (...paths) => path.join(__dirname, 'dist', ...paths)
const pathSrc = (...paths) => path.join(__dirname, 'src', ...paths)
const pathData = (...paths) => path.join(__dirname, 'data', ...paths)

// declare the entry point for jsx
const jsEntry = pathSrc('index.jsx')

// ==========
// INIT CONFIG
// initialise the config object
// ==========
const config = {
  // base directory of the entry
  context: pathSrc(),
  // all modules are loaded on startup, last one is exported
  entry: [require.resolve('babel-polyfill'), jsEntry],
  resolve: {
    // auto resolves these extensions, allows for leaving off ext when importing
    extensions: ['.js', '.jsx'],
    // what directories to be searched when resolving modules
    modules: [pathSrc(), pathData(), 'node_modules']
  },
  module: {rules: []},
  plugins: []
}

// ==========
// OUTPUT
// how to write compiled file to disk
// ==========
config.output = {
  // the absolute path
  path: pathBuild(),
  filename: 'bundle.js'
}

// ==========
// HANDLE JS/JSX
// compliments babel-polyfill
// ==========
config.module.rules.push({
  test: /\.jsx?$/,
  exclude: /(node_modules|bower_components)/,
  use: ['babel-loader']
})

// ==========
// SUPPORT IMAGES
// ==========
config.module.rules.push({
  test: /\.(png|gif|jpe?g|svg)$/,
  loader: 'file-loader',
  options: {
    name: 'assets/imgs/[name].[ext]',
  }
})

// ==========
// SUPPORT FONT
// ==========
config.module.rules.push({
  test: /\.(woff|woff2|eot|ttf|otf)$/,
  use: [
    {
      loader: `url-loader?limit=100000`,
      options: {
        name: '[path][name].[ext]'
      }
    }
  ]
})

// ==========
// SUPPORT CSS
// ==========
config.module.rules.push(
  {
    test: /\.css$/,
    include: /node_modules/,
    use: ['style-loader', 'css-loader']
  }
)

// create global constants which can be configured at compile time
config.plugins.push(new webpack.DefinePlugin({
  'process.env': {
    'NODE_ENV': '"' + process.env.NODE_ENV + '"',
    'PUBLIC_PATH': JSON.stringify("")
  }
}))

// ==========
// COPY HTML ENTRY FILE
// ==========
config.plugins.push(new HtmlWebpackPlugin({
  template: pathBuild('index.html'),
  title: 'React Webpack',
  appMountId: 'app'
}))

module.exports = {
  config,
  jsEntry
}