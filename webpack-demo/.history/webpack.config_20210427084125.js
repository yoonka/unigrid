const path = require('path');

module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname, './src/index.js'),
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
        ],
    }  resolve: {
        extensions: ['*', '.js', '.jsx'],
    },
    devServer: {
        contentBase: './dist',
    },
    output: {
        filename: 'main.js',
        // chunkFilename: '[name].main.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
    },
};