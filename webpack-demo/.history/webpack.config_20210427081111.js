const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    devServer: {
        contentBase: './dist',
    },
    output: {
        filename: '[name].main.js',
        chunkFilename: '[name].main.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
    },
};