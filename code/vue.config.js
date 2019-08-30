const path = require("path");
const Dateformat = require("dateformat");

process.env.VUE_APP_BUILD_TIME = Dateformat();

function resolve(dir) {
  return path.resolve(__dirname, dir);
}

module.exports = {
  pages: {
    index: {
      entry: "src/main",
      template: "public/index.html"
    }
  },
  configureWebpack: {
    devtool: "source-map"
  },
  assetsDir: "res",
  runtimeCompiler: true,
  chainWebpack: function(config) {
    config.plugin("html-index").tap(options => {
      options[0].minify = {
        removeComments: false,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        collapseBooleanAttributes: true,
        removeScriptTypeAttributes: true
      };
      return options;
    });

    const svgIconPath = resolve("src/assets/svg");

    config.module
      .rule("svg")
      .exclude.add(svgIconPath)
      .end();

    config.module
      .rule("svg-assets")
      .test(/\.svg(\?.*)?$/)
      .include.add(svgIconPath)
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "[name]-[hash:7]"
      })
      .end()
      .use("svgo-loader")
      .loader("svgo-loader")
      .options({
        plugins: [
          { removeTitle: true },
          { convertColors: { shorthex: false } },
          { convertPathData: false },
          { removeUselessStrokeAndFill: true }
        ]
      })
      .end();
  },
  // devServer: {
  //   open: true,
  //   proxy: {
  //     "/api": {
  //       target: process.env.VUE_APP_API_PROXY,
  //       changeOrigin: true,
  //       ws: false,
  //       pathRewrite: {
  //         "^/api": ""
  //       }
  //     }
  //   }
  // }
};
