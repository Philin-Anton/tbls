'use strict';
const path = require('path');
const sourcePath = path.join(__dirname, '../src');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    context: sourcePath,
    devtool: 'eval',
    entry: [
        'babel-polyfill',
        './index.js'
    ],
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'assets/bundle.js',
        publicPath: './'
    },
    node: {
        fs: 'empty'
    },
    resolve: {
        extensions: ['.js', '.json'],
        modules: [
            'node_modules'
        ],
        alias: {
            styles: `${sourcePath}/styles/`
        }
    },
    module: {
        rules: [
            {
            test: /\.(js)$/,
            exclude: /node_modules/,
            include: sourcePath,
            enforce: 'pre',
            loader: 'eslint-loader'
            },
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                module: true, // css-loader 0.14.5 compatible
                                modules: true,
                                localIdentName: '[local]'
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                outputStyle: 'collapsed',
                                sourceMap: true,
                                includePaths: [sourcePath]
                            }
                        }
                    ]
                })
            }
        ]
    },
    plugins: []
};