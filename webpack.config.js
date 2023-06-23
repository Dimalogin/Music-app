const { resolve } = require("node:path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = (argv, env) => {
  return {
    target: "web",
    mode: "development",
    devtool: "source-map",
    entry: {
      main: "./music-app/index",
    },
    output: {
      path: resolve(__dirname, "./dist"),
      filename: "[name].[contenthash].js",
      clean: true,
    },
    resolve: {
      extensions: [".ts", ".js"],
    },
    module: {
      rules: [
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/,
          type: "asset/resoure",
          generator: {
            filename: "images/[hash][ext]",
          },
        },
        {
          test: /\.ts$/,
          use: "ts-loader",
        },
        {
          test: /\.s?css$/,
          use: ["style-loader", "css-loader", "sass-loader"],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./music-app/index.html",
      }),
      new MiniCssExtractPlugin({
        filename: "[name].[contenthash].css",
      }),
      new CopyPlugin({
        patterns: [
          {
            from: resolve(__dirname, "music-app/images"),
            to: resolve(__dirname, "dist/images"),
          },
        ],
      }),
    ],
  };
};
