const webpack = require("webpack");
const path = require("path");

module.exports = {
  mode: "development", // development production
  entry: "./src3/index.js",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "main.js"
  }
};
