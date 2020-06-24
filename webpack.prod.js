const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const CopyPlugin = require("copy-webpack-plugin"); // Ini untuk menginisialisasi plugin webpack-copy-plugin supaya bisa dipanggil

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
  // Jadi aku nambahin " plugins " supaya nantinya ketika proses building, plugins ini akan beraksi
  // Di pluginsnya aku pakai kan " Copy Webpack Plugin" yang gunanya untuk mengkopy source ke  folder bundling
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "src/nav.html", to: "src/" },
        { from: "src/pages/", to: "src/pages/" },
        { from: "service-worker.js" },
        { from: "manifest.json" },
        { from: "src/assets/", to: "src/assets" },
        // Aku ubah beberapa nih, supaya sesuai dengan yang nanti dipakai lokasinya, hehe

        /* Ini artinya si webpack copy akan menyalin asset nav.html yang berada di folder src kedalam folder hasil bundling ( dist )*/
      ],
    }),
  ],
});

/*
plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'source', to: 'dest' }, sebenarnya seperti ini konfigurasi defaultnya,
        { from: 'other', to: 'public' }, 
      ],
    }),
  ], */
