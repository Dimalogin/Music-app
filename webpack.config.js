const { resolve } = require("node:path");

module.exports = (env, argy) => {
  return {
    target: "web",
    mode: "development",
    entry: {
      main: "./src/index",
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
          test: /\.ts$/,
          use: "ts-loader",
        },
      ],
    },
  };
};
