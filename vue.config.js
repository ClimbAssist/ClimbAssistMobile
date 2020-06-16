module.exports = {
  publicPath: '',
  pluginOptions: {
    cordovaPath: 'src-cordova'
  },
  chainWebpack: config => {
    // gltf loader
    config.module
      .rule("gltf")
      .test(/\.(glb|gltf)$/)
      .use("file-loader")
      .loader("file-loader");
  }
}
