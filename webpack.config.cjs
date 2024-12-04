/** @type {import("webpack").Configuration} */

const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const Dotenv = require("dotenv-webpack");

const devMode = process.env.NODE_ENV !== "production";

module.exports = {
    mode: "development",
    entry: {
        content: "./src/content/index.ts",
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
            { test: /\.tsx?$/, use: devMode ? "ts-loader" : "babel-loader", exclude: /node_modules/ },
            { test: /\.svg$/, use: "svg-inline-loader" },
            {
                test: /\.css$/,
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
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({ filename: "[name].bundle.css" }),
        new CopyWebpackPlugin({ patterns: [{ from: "static" }] }),
        new Dotenv({ safe: true, path: "./.env" }),
    ],
};
