const path = require('path');

module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname, './src/index.js'),

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