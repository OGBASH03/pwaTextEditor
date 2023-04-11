const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');
const { InjectManifest } = require('workbox-webpack-plugin');

// THIS MODULE EXPORTS AN OBJECT THAT CONTAINS THE FOLLOWING PROPERTIES:
module.exports = () => {
  return {
    //THE 'MODE' PROPERTY IS SET TO 'DEVELOPMENT' WHICH WILL ENABLE DEVELOPMENT TOOLS LIKE SOURCE MAPS AND LIVE RELOADING.
    mode: 'development',
    entry: {
      main: './src/js/index.js',
      install: './src/js/install.js'
    },
    //THE 'OUTPUT' PROPERTY SPECIFIES THE OUTPUT CONFIGURATION FOR THE BUNDLED FILES. THE 'FILENAME' PROPERTY IS SET TO '[NAME].BUNDLE.JS' WHERE [NAME] WILL BE REPLACED BY THE NAME OF THE ENTRY POINT. THE 'PATH' PROPERTY IS SET TO THE DIRECTORY WHERE THE BUNDLED FILES WILL BE GENERATED.
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    //THE 'PLUGINS' PROPERTY IS AN ARRAY OF PLUGINS THAT WILL BE APPLIED TO THE BUNDLING PROCESS.
    plugins: [
      new HtmlWebpackPlugin({
        template: './index.html',
        title: 'J.A.T.E'
      }),
      new InjectManifest({
        swSrc: './src-sw.js',
        swDest: 'src-sw.js',
      }),
      new WebpackPwaManifest({
        fingerprints: false,
        inject: true,
        name: 'Just Another Text Editor',
        short_name: 'J.A.T.E',
        description: 'Takes notes with JavaScript syntax highlighting!',
        background_color: '#225ca3',
        theme_color: '#225ca3',
        start_url: '/',
        publicPath: '/',
        icons: [
          {
            src: path.resolve('src/images/logo.png'),
            sizes: [96, 128, 192, 256, 384, 512],
            destination: path.join('assets', 'icons'),
          },
        ],
      }),
    ],
    // THIS MODULE INCLUDES TWO RULES FOR PROCESSING CSS AND JS FILES
    module: {
      rules: [
        {
          // THE FIRST RULE IS FOR CSS FILES AND USES THE 'STYLE-LOADER' AND 'CSS-LOADER'
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          // THE SECOND RULE IS FOR JS FILES, USING THE 'BABEL-LOADER' TO TRANSPILE TO OLDER VERSIONS OF JS
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            // THE 'BABEL-LOADER' USES OPTIONS TO SPECIFY PRESETS AND PLUGINS TO BE USED
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-proposal-object-rest-spread', '@babel/transform-runtime'],
            },
          },
        },
      ],
    },
  };
};
