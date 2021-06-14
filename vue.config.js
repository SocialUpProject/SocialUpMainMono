const webpack = require('webpack');
const path = require('path');

const config = {
  transpileDependencies: [
    'vuetify',
  ],
  lintOnSave: process.env.NODE_ENV !== 'production',
  publicPath: process.env.PUBLIC_PATH,
  devServer: {
    port: process.env.LOCAL_BUILD_PORT,
    historyApiFallback: true,
  },
  configureWebpack: {
    resolve: {
      alias: {
        'assets': path.join(__dirname, 'src/assets'),
        '@images': path.join(__dirname, 'src/assets/images'),
        '@': path.join(__dirname, 'src'),
      },
    },
    plugins: [
      new webpack.EnvironmentPlugin({
        API_URL: process.env.API_URL,
      }),
    ],
  },
};

module.exports = config;
