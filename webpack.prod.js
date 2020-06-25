const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  module: {
    rules: [
      /* babel loader */
      {
        test: /\.js$/,
        exclude: "/node_modules/",
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        ],
      },
    ],
  },
  // ketika proses building, plugins ini akan beraksi
  // Di pluginsnya Copy Webpack Plugin yang gunanya untuk mengkopy source ke  folder bundling
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "src/nav.html", to: "src/" },
        { from: "src/pages/", to: "src/pages/" },
        { from: "service-worker.js" },
        { from: "manifest.json" },
        { from: "src/assets/", to: "src/assets" },
        { from: "src/js/main.js", to: "src/js" },
        { from: "src/js/api.js", to: "src/js" },
        { from: "src/js/db.js", to: "src/js" },
        { from: "src/js/idb.js", to: "src/js" },
        { from: "article.html" },
        /* Ini artinya si webpack copy akan menyalin asset nav.html yang berada di folder src kedalam folder hasil bundling ( dist )*/
      ],
    }),
  ],
});
