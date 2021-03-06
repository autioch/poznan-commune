/* eslint-disable no-undefined */
/* eslint-disable no-inline-comments */
/* eslint-disable line-comment-position */
const { join } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const autoprefixer = require('autoprefixer');

const { argv } = require('yargs').options({
  production: {
    alias: 'p',
    'default': false,
    type: 'boolean'
  },
  watch: {
    'default': false,
    type: 'boolean'
  },
  port: {
    'default': 8080, // eslint-disable-line no-magic-numbers
    type: 'number'
  }
});

const projectPath = __dirname;
const sourcePath = join(projectPath, 'src');
const buildPath = join(projectPath, '..', 'docs');
const nameSuffix = argv.production ? `${new Date().getTime()}.min` : '';

if (argv.watch) {
  require('serve-local')(buildPath, argv.port);
}

module.exports = {
  mode: argv.production ? 'production' : 'development',
  entry: join(sourcePath, 'index.js'),
  devtool: argv.production ? undefined : 'eval',
  output: {
    path: buildPath,
    filename: `files/main${nameSuffix}.js`,
    publicPath: argv.production ? '/poznan-commune/' : '/',
    pathinfo: false
  },
  resolve: {
    extensions: ['.js', '.css', '.scss', '.svg'],
    modules: [
      sourcePath,
      'node_modules'
    ]
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          plugins: [
            '@babel/plugin-syntax-dynamic-import',

            // for now we need to transform these items for webpack to be able to parse the files
            '@babel/plugin-proposal-optional-chaining',
            '@babel/plugin-proposal-nullish-coalescing-operator'
          ],
          presets: ['@babel/preset-env']
        }
      }
    }, {
      test: /\.(ttf|eot|woff|png)$/i,
      use: {
        loader: 'file-loader',
        options: {
          name: 'files/[name].[ext]'
        }
      }
    }, {
      test: /\.scss$/i,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            sourceMap: false,
            plugins: () => [autoprefixer({
              cascade: false
            })]
          }
        },
        'sass-loader'
      ]
    }, {
      test: /\.css$/i,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            sourceMap: false,
            plugins: () => [autoprefixer({
              cascade: false
            })]
          }
        }
      ]
    }]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: `files/main${nameSuffix}.css`
    }),
    new HtmlWebpackPlugin({
      template: join(sourcePath, 'index.html'),
      filename: 'index.html'
    }),
    argv.watch ? new LiveReloadPlugin({
      appendScriptTag: true,
      ignore: /.(config|ico|js|json|html|template|woff)$/
    }) : undefined,
    argv.production ? new UglifyJsPlugin({
      sourceMap: false
    }) : undefined
  ].filter((plugin) => plugin !== undefined),
  stats: {
    assetsSort: 'size',
    children: false,
    entrypoints: false,
    hash: false,
    version: false
  }
};
