'use strict';

/**
     "webpack-bundle-analyzer": "4.7.0",
       "react-virtualized": "^9.22.3",
  "react-search-field": "^2.0.1",
   "extract-text-webpack-plugin": "3.0.2",
   "optimize-css-assets-webpack-plugin": "^5.0.3",
       "react-sizeme": "^2.6.12",
        "react-swipeable-views": "^0.13.9",
         "react-tap-event-plugin": "^3.0.3",
             "@babel/plugin-proposal-class-properties": "^7.10.4",
                 "simple-react-lightbox": "^3.6.9-0",
                     "bootstrap": "5.2.2",
                         "lodash": "^4.17.21",
                             "reactstrap": "^8.5.1",
                                 "socket.io-client": "^2.5.0",
                                     "promise": "^8.1.0",
 */
/*
    "@fortawesome/fontawesome-free": "^5.14.0",
    "enzyme": "3.11.0",
    "eslint": "7.2.0",
    "eslint-loader": "4.0.2",
    "eslint-plugin-import": "2.26.0",
    "eslint-plugin-jsx-a11y": "6.6.1",
    "eslint-plugin-react": "7.31.10",
    "html-entities": "^2.3.2",  
    "immer": "^9.0.6",
    "linguist-languages": "^7.10.0",
    "loader-utils": "^2.0.0",
    "material-dashboard-react": "^1.9.0",
    "micro": "^9.3.4",    
    "mini-create-react-context": "^0.4.1",
    "react-chartjs-2": "^2.9.0",    
    "react-app-polyfill": "^1.0.6",
    "react-dev-utils": "^12.0.1",
    //dev dependicies
    
    "@types/node": "^18.11.9",
    :
    "vite": "^3.1.0",
    "vite-plugin-compression": "^0.5.1",
    "vite-plugin-css-injected-by-js": "^2.1.0",
    "vite-plugin-minify": "^1.5.2",

    "@vitejs/plugin-react": "^2.1.0",
    "bundlesize": "0.18.1",
    "auto-css-modules-webpack-plugin": "^1.1.1",
    "source-map-loader": "^3.0.0",
    "postcss-loader": "^3.0.0",
    "postcss-preset-env": "^6.7.0",
    "postcss-safe-parser": "^4.0.2",

    "dom-helpers": "3.4.0",
    "dom-helpers5": "npm:dom-helpers@5.1.3",


    "terser-webpack-plugin": "^5.3.6",
*/
const webpack = require('webpack');
//const TerserPlugin = require("terser-webpack-plugin");
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");
//const MiniCssExtractPlugin = require("mini-css-extract-plugin");
console.log(process.env.NODE_ENV);
const CopyPlugin = require("copy-webpack-plugin");

const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");

const smp = new SpeedMeasurePlugin();

module.exports = smp.wrap({
    mode: process.env.NODE_ENV,
    entry: {
        main: ['@babel/polyfill', './src/index.tsx'],
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|json|ts|tsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            /*
            {
                test: /\.(ts|tsx)$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            */
            {
                test: /\.(scss|css)$/,
                use: [
                    {
                        loader: 'style-loader', // creates style nodes from JS strings
                    },
                    {
                        loader: 'css-loader', // translates CSS into CommonJS
                    },
                    {
                        loader: 'sass-loader', // compiles Sass to CSS
                    },
                ],
            },
            {
                test: /\.(png|svg|jpg|gif|ico|ttf|woff|eot)$/,
                use: [
                    {
                        loader: 'url-loader?limit=25000',
                        //8192
                    },
                ],
            },
            { test: /\.woff2(\?v=[0-9]\.[0-9]\.[0-9])?$/i, loader: 'url-loader', options: { limit: 10000, mimetype: 'application/font-woff2' } },
            { test: /\.woff(\?v=[0-9]\.[0-9]\.[0-9])?$/i, loader: 'url-loader', options: { limit: 10000, mimetype: 'application/font-woff' } },
            { test: /\.(ttf|eot|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/i, loader: 'file-loader' },
        ],
    },
    resolve: {
        extensions: ['*', '.js', '.jsx', '.config.js', '.web.js', '.scss', '.ts', '.tsx'],
        modules: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'node_modules')],
        alias: { /*'dom-helpers': 'dom-helpers5',*/ 'src': path.resolve(__dirname, 'src') },
    },
    output: {
        path: __dirname + '/dist/',
        publicPath: '/',
        filename: '[name].min.js',
    },
    devtool: process.env.NODE_ENV === 'production' ? false : 'source-map',
    plugins: [
        //new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                PUBLIC_URL: JSON.stringify('http://localhost:8000'),
                DEPLOY_URL: JSON.stringify('https://sweeetheart.herokuapp.com'),
            },
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'public', 'index.html'),
        }),
        new CompressionPlugin({
            filename: "[path][base].gz",
            algorithm: "gzip",
            test: /\.js$|\.css$|\.html$/,
            threshold: 10240,
            minRatio: 0.8
        }),
        new CopyPlugin({
            patterns: [
                { from: "./public/robots.txt", to: "./" },
            ],
        }),
        //new MiniCssExtractPlugin({ filename: "style.css" })
    ],
    /*optimization: {
        minimize: true,
        //minimizer: [new TerserPlugin()],
    },*/
    devServer: {
        historyApiFallback: true,
        port: 3000,
        hot: true
    },
    performance: {
        hints: false,
    },
});

/*

  new UglifyJsPlugin({
                sourceMap: true,
            }),

*/