/** @type {import("webpack").Configuration} */

const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const mode = process.env.NODE_ENV || "development";
const isDev = mode === "development";

module.exports = {
    mode,
    watchOptions: {
        ignored: /node_modules/,
    },
    performance: {
        hints: false,
    },
    entry: {
        content: "./src/content/index.ts",
        popup: "./src/popup/index.tsx",
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].bundle.js",
    },
    devtool: false,
    target: ["web", "es5"],
    resolve: {
        extensions: [".js", ".ts", ".tsx"],
        alias: {
            "@": path.resolve(__dirname, "src", "popup"),
            "@src": path.resolve(__dirname, "src"),
        },
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                react: {
                    test: /[\\/]node_modules[\\/]((.*react|@radix|@remix).*)[\\/]/,
                    name: "react.vendor",
                    chunks: "all",
                },
            },
        },
    },
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
                            modules: {
                                localIdentName: isDev ? "[path][name]__[local]" : "[hash:base64:6]__[local]",
                            },
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
        new BundleAnalyzerPlugin({ openAnalyzer: false }),
        isDev && new webpack.SourceMapDevToolPlugin({ exclude: [/.vendor.bundle.js$/] }),
    ],
};
