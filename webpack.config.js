const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { AureliaPlugin } = require('aurelia-webpack-plugin');
const { ProvidePlugin, DefinePlugin } = require('webpack');

const ensureArray = (config) => config && (Array.isArray(config) ? config : [config]) || []
const when = (condition, config, negativeConfig) =>
    condition ? ensureArray(config) : ensureArray(negativeConfig)

const title = 'Built With Aurelia';
const outDir = path.resolve(__dirname, 'dist');
const srcDir = path.resolve(__dirname, 'src');
const nodeModulesDir = path.resolve(__dirname, 'node_modules');
const baseUrl = '/';

const cssRules = [
    { loader: 'css-loader' },
    {
        loader: 'postcss-loader',
        options: { plugins: () => [require('autoprefixer')({ browsers: ['last 2 versions'] })] }
    }
]

const scssRules = [
    { loader: 'css-loader' },
    {
        loader: 'postcss-loader',
        options: { plugins: () => [require('autoprefixer')({ browsers: ['last 2 versions'] })] }
    },
    {
        loader: 'sass-loader'
    }
];

module.exports = ({ production, server, extractCss, coverage, ssr } = {}) => ({
    resolve: {
        extensions: ['.ts', '.js'],
        modules: [srcDir, 'node_modules'],
    },
    entry: {
        app: ['aurelia-bootstrapper'],
        vendor: ['bluebird', 'jquery', 'bootstrap'],
    },
    mode: production ? 'production' : 'development',
    output: {
        path: outDir,
        publicPath: baseUrl,
        filename: production ? '[name].[chunkhash].bundle.js' : '[name].[hash].bundle.js',
        sourceMapFilename: production ? '[name].[chunkhash].bundle.map' : '[name].[hash].bundle.map',
        chunkFilename: production ? '[name].[chunkhash].chunk.js' : '[name].[hash].chunk.js'
    },
    performance: { hints: false },
    devServer: {
        contentBase: outDir,
        historyApiFallback: true,
    },
    devtool: production ? 'nosources-source-map' : 'cheap-module-eval-source-map',
    module: {
        rules: [
            {
                test: /\.css$/i,
                issuer: [{ not: [{ test: /\.html$/i }] }],
                use: [
                    !production ? 'style-loader' : MiniCssExtractPlugin.loader,
                    ...cssRules
                ]
            },
            {
                test: /\.css$/i,
                issuer: [{ test: /\.html$/i }],
                use: cssRules,
            },
            {
                test: /\.scss$/,
                use: [
                    !production ? 'style-loader' : MiniCssExtractPlugin.loader,
                    ...scssRules
                ]
            },
            { test: /\.html$/i, loader: 'html-loader' },
            { test: /\.ts$/i, loader: 'ts-loader', exclude: nodeModulesDir },
            { test: /\.json$/i, loader: 'json-loader' },
            { test: /[\/\\]node_modules[\/\\]bluebird[\/\\].+\.js$/, loader: 'expose-loader?Promise' },
            { test: require.resolve('jquery'), loader: 'expose-loader?$!expose-loader?jQuery' },
            { test: /\.(png|gif|jpg|cur)$/i, loader: 'url-loader', options: { limit: 8192 } },
            { test: /\.woff2(\?v=[0-9]\.[0-9]\.[0-9])?$/i, loader: 'url-loader', options: { limit: 10000, mimetype: 'application/font-woff2' } },
            { test: /\.woff(\?v=[0-9]\.[0-9]\.[0-9])?$/i, loader: 'url-loader', options: { limit: 10000, mimetype: 'application/font-woff' } },
            { test: /\.(ttf|eot|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/i, loader: 'file-loader' },
            ...when(coverage, {
                test: /\.[jt]s$/i, loader: 'istanbul-instrumenter-loader',
                include: srcDir, exclude: [/\.{spec,test}\.[jt]s$/i],
                enforce: 'post', options: { esModules: true },
            })
        ]
    },
    plugins: [
        new AureliaPlugin(),
        new ProvidePlugin({
            'Promise': 'bluebird',
            '$': 'jquery',
            'jQuery': 'jquery',
            'window.jQuery': 'jquery',
            'fetch': 'imports-loader?this=>global!exports-loader?global.fetch!isomorphic-fetch'
        }),
        new HtmlWebpackPlugin({
            filename: ssr ? 'index.ssr.html' : 'index.html',
            template: ssr ? 'index.ssr.ejs' : 'index.ejs',
            minify: undefined,
            metadata: {
                title, server, baseUrl
            },
        }),
        new CopyWebpackPlugin([
            { from: 'favicon.ico', to: 'favicon.ico' }
        ]),
        new MiniCssExtractPlugin({
            filename: !production ? '[name].css' : '[name].[hash].css',
            chunkFilename: !production ? '[id].css' : '[id].[hash].css',
        })
    ],
})
