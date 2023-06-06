const {} = require("node:path");

module.exports = (env, argy) => {
  return {
    target: "web",
    mode: "development",
    entry: {
      main: "./src/index.ts",
    },
    output: {
      path: resolve(__dirname, "./dist"),
      filename: "[name].[contenthash].js",
      clean: true,
    },
    resolve: {
      extentions: [".ts", ".js"],
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
