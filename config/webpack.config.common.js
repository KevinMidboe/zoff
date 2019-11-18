"use strict";

const VueLoaderPlugin = require("vue-loader/lib/plugin");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");
const helpers = require("./helpers");
const isDev = process.env.NODE_ENV === "development";

const webpackConfig = function(isDev) {
  return {
    entry: {
      main: ["@babel/polyfill", helpers.root("frontend", "main")]
    },
    resolve: {
      extensions: [".js", ".vue"],
      alias: {
        vue$: isDev ? "vue/dist/vue.runtime.js" : "vue/dist/vue.runtime.min.js",
        "@": helpers.root("frontend")
      }
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: "vue-loader",
          include: [helpers.root("frontend")]
        },
        {
          test: /\.js$/,
          loader: "babel-loader",
          include: [helpers.root("frontend")]
        },
        /*{
          test: /\.css$/,
          use: [
            isDev ? "vue-style-loader" : MiniCSSExtractPlugin.loader,
            { loader: "css-loader", options: { sourceMap: isDev } }
          ]
        },
        {
          test: /\.scss$/,
          use: [
            isDev ? "vue-style-loader" : MiniCSSExtractPlugin.loader,
            { loader: "css-loader", options: { sourceMap: isDev } },
            { loader: "sass-loader", options: { sourceMap: isDev } }
          ]
        },
        {
          test: /\.sass$/,
          use: [
            isDev ? "vue-style-loader" : MiniCSSExtractPlugin.loader,
            { loader: "css-loader", options: { sourceMap: isDev } },
            { loader: "sass-loader", options: { sourceMap: isDev } }
          ]
        },*/
        {
          test: /\.s(c|a)ss$/,
          use: [
            'vue-style-loader',
            'css-loader',
            {
              loader: 'sass-loader',
              // Requires sass-loader@^7.0.0
              options: {
                implementation: require('sass'),
                fiber: require('fibers'),
                indentedSyntax: true // optional
              },
              // Requires sass-loader@^8.0.0
              options: {
                implementation: require('sass'),
                sassOptions: {
                  fiber: require('fibers'),
                  indentedSyntax: true // optional
                },
              },
            },
          ],
        },
      ]
    },
    plugins: [new VueLoaderPlugin()]
  };
};

module.exports = webpackConfig;
