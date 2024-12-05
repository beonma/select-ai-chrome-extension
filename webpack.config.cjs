/** @type {import("webpack").Configuration} */

const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const Dotenv = require("dotenv-webpack");

const devMode = process.env.NODE_ENV !== "production";

module.exports = {
    mode: "development",
    watchOptions: {
        ignored: /node_modules/,
    },
    entry: {
        content: "./src/content/index.ts",
        popup: "./src/popup/index.tsx",
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].bundle.js",
    },
    devtool: "cheap-source-map",
    target: ["web", "es5"],
    resolve: { extensions: [".ts", ".tsx"] },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [{ loader: "babel-loader", options: { cacheDirectory: true } }],
                exclude: /node_modules/,
            },
            { test: /\.svg$/, use: "svg-inline-loader" },
            {
                test: /\.module\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            modules: { localIdentName: devMode ? "[path][name]__[local]" : "[hash:base64:6]__[local]" },
                        },
                    },
                ],
            },
            {
                test: /(?<!\.module)\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({ filename: "[name].bundle.css" }),
        new CopyWebpackPlugin({ patterns: [{ from: "static" }] }),
        new Dotenv({ safe: true, path: "./.env" }),
        new ForkTsCheckerWebpackPlugin(),
    ],
};
