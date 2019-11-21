import VuetifyLoaderPlugin from 'vuetify-loader/lib/plugin'

export default {
  build: {
    transpile: [
      'vuetify/lib'
    ],
    plugins: [
      new VuetifyLoaderPlugin()
    ],
    loaders: {
      stylus: {
        import: ['~assets/style/variables.styl']
      }
    },
    extractCSS: true,
    extend (config, ctx) {
      config.node = {
        fs: 'empty'
      }

      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
        // config.module.rules.push({
        //   test: /\.s(c|a)ss$/,
        //   use: [
        //     'vue-style-loader',
        //     'css-loader', {
        //       loader: 'sass-loader',
        //       options: {
        //         implementaiton: require('sass'),
        //         indentedSyntax: true
        //       }
        //     }
        //   ]
        // })
      }
    }
  },
  css: [
    '@mdi/font/css/materialdesignicons.css',
    // '@fortawesome/fontawesome-free/css/all.css',
    'material-design-icons-iconfont/dist/material-design-icons.css'
  ],
  plugins: [
    '@plugins/vuetify'
  ]
  // modules: [
  //   ''
  // ]
}
