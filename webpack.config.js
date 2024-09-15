/** @type {import("webpack").Configuration} */

const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const Dotenv = require("dotenv-webpack");

module.exports = {
    mode: "development",
    entry: {
        content: "./src/content/index.js",
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].bundle.js",
    },
    devtool: "cheap-source-map",
    target: ["web", "es5"],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: { modules: { localIdentName: "[hash:base64:6]__[local]" } },
                    },
                ],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({ filename: "[name].bundle.css" }),
        new CopyWebpackPlugin({ patterns: [{ from: "static" }] }),
        new Dotenv({ safe: true, path: "./.env" }),
    ],
};
