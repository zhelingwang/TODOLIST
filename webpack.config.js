const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "development",
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    port: 5000,
    open: true
  },
  entry: {
    index: path.resolve(__dirname, "src/index.js"),
    "service-worker": path.resolve(__dirname, "src/service-worker.js")
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js"
    // filename: '[name].[contenthash:10].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader"
      },
      {
        test: /\.js$/,
        loader: "babel-loader"
      },
      {
        test: /\.css$/,
        use: ["vue-style-loader", "css-loader"]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ["file-loader"]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ["file-loader"]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: "src/index.html"
    })
    // new CleanWebpackPlugin()
  ]
  // optimization: {
  //     splitChunks: {
  //         chunks: 'all',
  //     }
  // }
};
