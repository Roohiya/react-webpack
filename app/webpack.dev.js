const common = require('./webpack.common.js')
const webpack = require('webpack')
const merge = require('webpack-merge')

const config = {
    devtool: 'eval',
    entry: [],
    output: {},
    module: {rules: []},
    plugins: [
      new webpack.NamedModulesPlugin()
    ]
  }
  
  // format name of bundle file without chunkhash for dev and uat
  config.output.sourceMapFilename = 'assets/js/[name].map'

// ==========
// DEV SERVER
// ==========
config.devServer = {
    port: 3000,
    // lets the server listen for requests from the network, not just localhost
    host: '0.0.0.0',
    // Enable gzip compression for everything served
    compress: true,
    disableHostCheck: true,
    historyApiFallback: {
        // fallback in cases of 404
        index: 'index.html'
    }
}
  
// ==========
// CSS LOADER
// ==========
config.module.rules.push({
    test: /\.css$/,
    exclude: /node_modules/,
    use: [
        'style-loader',
        {
        loader: 'css-loader',
        options: {
            sourceMap: true
        }
        }
    ]
})

// ==========
// STANDARD JS
// ==========
config.module.rules.push({
    test: /\.jsx?$/,
    use: ['standard-loader'],
    exclude: /(node_modules|bower_components|ext_libs)/,
    enforce: 'pre'
})

const mergedConfig = merge(common.config, config)

module.exports = mergedConfig