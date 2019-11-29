let path = require('path')

module.exports = {
  mode: 'development', // production development
  entry: './src3/index.js',
  output: {
    path: path.join(__dirname, "dist"),
    filename: "main.js"
  }
}