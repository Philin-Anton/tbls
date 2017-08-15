'use strict';
const path = require('path');
const baseConfig = require('./base');
const sourcePath = path.join(__dirname, '../src');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

const config = Object.assign({}, baseConfig, {
    cache: true,
    devtool: 'eval-source-map',
    devServer: {
        contentBase: path.join(__dirname, '/../src/'),
        historyApiFallback: true,
        hot: true,
        port: 8000,
        publicPath: 'http://localhost:8000/',
        noInfo: false
    },
    plugins: [
        new ProgressBarPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new WebpackNotifierPlugin({alwaysNotify: true}),
        new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify('development')}),
        new webpack.NoEmitOnErrorsPlugin(),
        new HtmlWebpackPlugin({hash: true, template: '../src/index.html'}),
        new ExtractTextPlugin('./styles/style-[contenthash:8].css')
    ]
});

module.exports = config;