const webpack = require("webpack");
const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
    entry: "./src/index.js",
    target: "node",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "./thundra-warmup.js",
        libraryTarget: "commonjs2",
        library: "thundra-warmup"
    },
    module: {
        rules: [
            {
                use: "babel-loader",
                exclude: /(node_modules)/,
                test: /\.js$/
            }
        ]
    },
    plugins: [
        new UglifyJsPlugin({
            uglifyOptions: {
                compress: {
                    warnings: false
                }
            },
            sourceMap: true,
            parallel: true
        }),
        new webpack.optimize.ModuleConcatenationPlugin()
    ]
};
