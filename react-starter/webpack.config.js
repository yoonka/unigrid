const webpack = require('webpack');
const path = require('path');



module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname, './src/index.js'),
    module: {

        rules: [
            {
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    "style-loader",
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                ],
            },
            {
                test: /\.json$/,
                loader: 'json-loader'

            },
            // {
            //     test: /\.(gif|png|jpe?g|svg)$/i,
            //     use: [
            //         'file-loader',
            //         {
            //             loader: 'image-webpack-loader',
            //             options: {
            //                 bypassOnDebug: true, // webpack@1.x
            //                 disable: true, // webpack@2.x and newer
            //             },
            //         },
            //     ],
            // }
        ],
    },

    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'bundle.js',
    },
    plugins: [new webpack.HotModuleReplacementPlugin()],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 4000,
    },
};