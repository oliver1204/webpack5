const webpack = require('webpack');  // webpack5
const webpackOptions = require('./webpack.config'); // webpack配置项

webpack(webpackOptions, (err, stats) => {
  if(err) {
    console.log(err);
  } else {
    console.log(stats.toJson({
      assets: false,
      hash: true
    }))
  }
})
