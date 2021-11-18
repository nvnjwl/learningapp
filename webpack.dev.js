/**
 * This is the DEV configuration for webpack
 * It will be used for development mode
 */
'use strict';
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'source-map',
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 3000,
        https: false,
        disableHostCheck: true
    },
    plugins: [],
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    // creates style nodes from JS strings
                    'style-loader',
                    // translates CSS into CommonJS
                    'css-loader',
                    // compiles Sass to CSS, using Node Sass by default
                    'sass-loader'
                ]
            }
        ]
    },
    output: {
        filename: './js/[name].[hash].js',
        path: path.resolve(__dirname, 'dist'),
        // Fix references to URLs: use absolute
        publicPath: '/'
    }
});
