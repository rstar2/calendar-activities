const fs = require("fs");
const path = require("path");

// const HtmlWebpackPlugin = require("html-webpack-plugin");
// const DumpVueEnvVarsWebpackPlugin = require('./DumpVueEnvVarsWebpackPlugin');

// simulate loading of the .env files as would the vue-cli-service
// do if they were in the vue app root folder:
//    .env                # loaded in all cases
//    .env.local          # loaded in all cases, ignored by git
//    .env.[mode]         # only loaded in specified mode
//    .env.[mode].local   # only loaded in specified mode, ignored by git

const dotenv = require("dotenv");
const files = ["../.env", "../.env.local"];
if (process.env.NODE_ENV === "production") {
  files.push("../.env.production", "../.env.production.local");
}

files
  .map((file) => path.resolve(__dirname, file))
  .filter((file) => fs.existsSync(file))
  .forEach((file) => {
    const envConfig = dotenv.parse(fs.readFileSync(file));
    if (envConfig) {
      for (const k in envConfig) {
        process.env[k] = envConfig[k];
      }
    }
  });

module.exports = {
  transpileDependencies: ["vuetify"],
  pwa: {
    // NOTE: match these with the ones written in 'public/manifest.json'
    // These are for Apple iOS
    name: "Calendar Activities",
    themeColor: "#b71c1c", // this is the vuetify.primary color
    msTileColor: "#AAAAAA",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black",

    // configure the workbox plugin
    // NOTE: See https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin#which_plugin_to_use
    // Use GenerateSW if:
    //     1.You want to precache files.
    //     2.You have simple runtime configuration needs (e.g. the configuration allows you to define routes and strategies).
    //     3.You DON'T want to use other Service Worker features (i.e. Web Push).
    //     4.You DON'T want to import additional scripts or add additional logic.
    // So 'InjectManifest' gives much more control
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      // swSrc is required in InjectManifest mode.
      swSrc: "src/service-worker.js",
      // ...other Workbox options...

      // NOTE!!! These options are not present for the 'InjectManifest' only for the 'GenerateSW'
      // so service-worker update should be implemented additionally in registerServiceWorker.js
      // skipWaiting: true,
      // clientsClaim: true,
    },
  },
  configureWebpack: {
    plugins: [
      // dump/export the env variables
      //   new DumpVueEnvVarsWebpackPlugin({ filename: "service-worker-env.js" }),
      //   new HtmlWebpackPlugin({ title: "TEst" }),
    ],
  },
  //   another way to config/update webpack
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      //   args[0].template = "./public/index.html";
      // by default title will be taken from the package.json 'name' property
      args[0].title = "Calendar Activities";
      return args;
    });
  },
};
