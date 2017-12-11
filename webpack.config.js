const path = require('path');
const webpack = require('webpack');
const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin');
const ngToolsWebpack = require('@ngtools/webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

function isExternal(module) {
    let userRequest = module.userRequest;

    if (typeof userRequest !== 'string') {
        return false;
    }

    return userRequest.indexOf('node_modules') >= 0;
}

module.exports = {
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'bundle'),
        filename: './bundle.[name].js',
        library: '[name]',
        libraryTarget: "var"
    },
    resolve: {
        modules: [
            "../node_modules",
        ],
        extensions: [
            '.ts',
            '.js',
            '.html',
            '.scss',
        ],
        alias: {
            "caja": "html-css-sanitizer",
            'resizeSensor': 'css-element-queries/src/ResizeSensor.js',
            "home": path.resolve('./src/app/home'),
        }
    },
    resolveLoader: {
        modules: [
            'node_modules',
            path.resolve(__dirname, 'loaders'),
        ],
    },
    module: {
        rules: [
            {
                test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
                use: [ '@ngtools/webpack' ]
            },
            {
                test: /app.*\.(css|scss)/,
                use: ['raw-loader'],
            },
            {
                test: /\.html$/,
                use: [
                    'html-loader',
                ],
            },
        ]
    },
    plugins: [
        new NamedModulesPlugin(),
        new ngToolsWebpack.AngularCompilerPlugin({
            tsConfigPath: './tsconfig.json',
            entryModule: 'src/app/app.module#AppModule',
            compilerOptions: {
                noEmit: false,
            }
        }),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            inject: true,
            filename: "bundle.html",
        }),
        new webpack.optimize.CommonsChunkPlugin({
            names: ["vendor"],
            minChunks: isExternal
        }),
        new webpack.optimize.CommonsChunkPlugin({
            names: ["manifest"],
            minChunks: Infinity
        }),
        new webpack.NoEmitOnErrorsPlugin(),
        new ProgressBarPlugin(),
    ]
};