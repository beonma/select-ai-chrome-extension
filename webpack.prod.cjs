const { merge } = require("webpack-merge");
const common = require("./webpack.common.cjs");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const Dotenv = require("dotenv-webpack");

module.exports = merge(common, {
    mode: "production",
    performance: {
        hints: "warning",
    },
    optimization: {
        minimizer: [
            new TerserPlugin({ terserOptions: { format: { comments: false } }, extractComments: false }),
            new CssMinimizerPlugin(),
        ],
    },
    output: { clean: true },
    module: {
        rules: [
            {
                test: /\.module\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            modules: {
                                localIdentName: "[hash:base64:6]__[local]",
                            },
                        },
                    },
                ],
            },
        ],
    },
    plugins: [new Dotenv({ safe: "./.env.example", path: "./.env.prod" })],
});
