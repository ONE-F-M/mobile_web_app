const path = require('path');

module.exports = {
  // transpileDependencies: ['ionicons'],
  filenameHashing: false,
  chainWebpack: config => {
    config.resolve.alias.set('@', path.resolve(__dirname, 'src'));
  }
};