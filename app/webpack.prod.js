const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const config = {
    devtool: shouldUseSourceMap ? 'source-map' : false,
    plugins: [
      new webpack.NamedModulesPlugin()
    ],
    entry: {
      main: [require.resolve('babel-polyfill'), common.jsEntry],
      vendor: [
        'react',
        'react-dom',
        'react-router-dom'
      ]
    },
    output: {},
    module: {
      rules: []
    }
}

// format name of bundle file with chunkhash for prod
config.output.filename = '[name].[chunkhash].js'

// ==========
// CSS LOADER + EXTRACTION
// ==========
config.module.rules.push({
  test: /\.css$/,
  exclude: /node_modules/,
  use: ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: [
      {
        loader: 'css-loader',
        options: {
        }
      }
    ]
  })
})

// ==========
// FORMAT BUNDLE NAME
// ==========
config.plugins.push(new ExtractTextPlugin({ filename: 'app.[chunkhash].css', allChunks: true }))

// ==========
// UGLIFY
// ==========
config.plugins.push(
    // Minify the code. (From react-script config)
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        // Disabled because of an issue with Uglify breaking seemingly valid code:
        // https://github.com/facebookincubator/create-react-app/issues/2376
        // Pending further investigation:
        // https://github.com/mishoo/UglifyJS2/issues/2011
        comparisons: false
      },
      mangle: {
        safari10: true
      },
      output: {
        comments: false,
        // Turned on because emoji and regex is not minified properly using default
        // https://github.com/facebookincubator/create-react-app/issues/2488
        ascii_only: true
      },
      sourceMap: shouldUseSourceMap
    })
  )
  
  // Separate vendor scripts
  config.plugins.push(
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
      filename: 'vendor.[chunkhash].js',
    })
  )
  
  const mergedConfig = merge(common.config, config)
  module.exports = mergedConfig

