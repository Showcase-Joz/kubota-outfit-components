const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

// Resolve workspace symlinks to dist so webpack watches library rebuilds.
// Keep one runtime instance of React/Emotion across the app and library.
const sharedResolve = {
  extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
  symlinks: true,
  alias: {
    "react/jsx-runtime": require.resolve("react/jsx-runtime.js"),
    ...Object.fromEntries(
      ["react", "react-dom", "@emotion/react", "@emotion/styled", "@outfit.io/react", "@babel/runtime"].map(
        (name) => [name, path.dirname(require.resolve(`${name}/package.json`))]
      )
    ),
  },
};

module.exports = (webpackConfigEnv, argv) => {
  if (webpackConfigEnv?.preview) {
    return {
      mode: argv.mode || "development",

      entry: path.resolve(__dirname, "src/preview.jsx"),
      output: {
        path: path.resolve(__dirname, "dist/preview"),
        filename: "preview.js",
      },
      devtool: "source-map",
      resolve: sharedResolve,
      module: {
        rules: [
          {
            test: /\.(js|ts)x?$/,
            exclude: /node_modules/,
            use: "babel-loader",
          },
        ],
      },
      plugins: [
        new HtmlWebpackPlugin({
          template: "public/index.html",
          title: "Offer option comparison",
        }),
      ],
      devServer: { host: "127.0.0.1", hot: false, liveReload: true },
    };
  }
  const defaultConfig = singleSpaDefaults({
    orgName: "jolyon-demo",
    projectName: "resizing_tool",
    webpackConfigEnv,
    argv,
  });
  const isProd = argv.mode === "production";

  return merge(defaultConfig, {
    resolve: sharedResolve,
    optimization: isProd
      ? {
          minimize: true,
          minimizer: [
            new TerserPlugin({
              terserOptions: { format: { ascii_only: true } },
            }),
          ],
        }
      : {},
  });
};
