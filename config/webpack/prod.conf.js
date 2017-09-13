var path = require('path')
var webpack = require('webpack')
var merge = require('webpack-merge')
var CleanWebpackPlugin = require('clean-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')

var Conf = require('../conf')
var baseWebpackConfig = require('./base.conf')

var prodWebpackConfig = merge(baseWebpackConfig, {
    output: {
        filename: 'js/[name].[chunkhash].js',
    },
    plugins: [
        new CleanWebpackPlugin(['dist'], {
            root: path.resolve(Conf.RootPath),
            verbose: true,
            dry: false,
        }),

        new CopyWebpackPlugin([
            {
                from: path.resolve(Conf.RootPath, 'assets'),
                to: path.resolve(Conf.RootPath, 'dist', 'assets'),
                ignore: ['.*']
            }
        ]),

        new webpack.DefinePlugin({
            BUILD: {
                MODE: JSON.stringify('production'),
                DEBUG: false,
            }
        }),

        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            sourceMap: true
        }),
    ]
})

module.exports = prodWebpackConfig
