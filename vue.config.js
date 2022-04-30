const registerRouter = require('./backend/router')

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        // 全局引入变量和 mixin  非实体样式通过配置sass-loader编译引入
        additionalData: `
          @import "@/assets/scss/variable.scss";
          @import "@/assets/scss/mixin.scss";
        `
      }
    }
  },
  devServer: {
    /*
     before 和 after 配置用于在 webpack-dev-server 定义额外的中间件，如
     before(app){
     app.get('/some/path', function(req, res) { // 当访问 /some/path 路径时，返回自定义的 json 数据
         res.json({ custom: 'response' })
      })
     }
     这里通过注册app服务，通过拦截请求代理请求获取第三方的网络资源并返回结果
     prod.server.js开启express服务是因为打包部署到生产环境的时候，就不需要webpack的开发服务器devServer，devServer一般是用来开发调试前端代码的
     */

    before(app) {
      registerRouter(app)
    }
  },
  configureWebpack: (config) => {
    if (process.env.npm_config_report) {
      const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
      config.plugins.push(new BundleAnalyzerPlugin())
    }
  },
  productionSourceMap: false,
  publicPath: process.env.NODE_ENV === 'production' ? '/music-next/' : '/'
}
