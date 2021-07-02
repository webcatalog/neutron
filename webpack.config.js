/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
// bundle forked scripts with webpack
// as in production, with asar, node_modules are not accessible in forked scripts

const path = require('path');
const fs = require('fs-extra');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const packageJson = require('./package.json');

const externals = {};
Object.keys(packageJson.dependencies)
  .forEach((name) => {
    externals[name] = `commonjs ${name}`;
  });

const getPreloadScriptsConfig = () => {
  const entry = {
    'view-preload': path.join(__dirname, 'main-src', 'libs', 'view-preload.js'),
    'adblocker-electron-preload': path.join(__dirname, 'node_modules', '@cliqz', 'adblocker-electron-preload', 'dist', 'es6', 'preload.js'),
  };

  fs.readdirSync(path.join(__dirname, 'main-src', 'windows'))
    .filter((fileName) => fileName.endsWith('-preload.js') && fileName !== 'shared-preload.js')
    .forEach((fileName) => {
      entry[fileName.replace('.js', '')] = path.join(__dirname, 'main-src', 'windows', fileName);
    });

  const plugins = [];
  return {
    mode: 'production',
    node: {
      global: false,
      __filename: false,
      __dirname: false,
    },
    externals,
    entry,
    target: 'electron-renderer',
    output: {
      path: path.join(__dirname, 'build'),
      filename: '[name].js',
    },
    devtool: 'source-map',
    plugins,
    // optimization: {
    //   minimize: false,
    // },
  };
};

const getElectronMainConfig = () => {
  const plugins = [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['libs'],
      cleanAfterEveryBuildPatterns: [],
    }),
    new webpack.DefinePlugin({
      'process.env.ELECTRON_APP_SENTRY_DSN': JSON.stringify(process.env.ELECTRON_APP_SENTRY_DSN),
      'process.env.ELECTRON_APP_GOOGLE_API_KEY': JSON.stringify(process.env.ELECTRON_APP_GOOGLE_API_KEY),
    }),
  ];

  const patterns = [];
  if (process.platform === 'win32') {
    patterns.push({
      from: path.join(__dirname, 'node_modules', 'regedit', 'vbs'),
      to: path.join(__dirname, 'build', 'vbs'),
    });
  }
  if (patterns.length > 0) {
    plugins.push(new CopyPlugin({ patterns }));
  }

  return {
    mode: 'production',
    node: {
      global: false,
      __filename: false,
      __dirname: false,
    },
    externals,
    entry: {
      electron: path.join(__dirname, 'main-src', 'electron.js'),
    },
    target: 'electron-main',
    output: {
      path: path.join(__dirname, 'build'),
      filename: '[name].js',
    },
    devtool: 'source-map',
    plugins,
    // optimization: {
    //   minimize: false,
    // },
  };
};

const getRecipeConfig = () => {
  const plugins = [];
  const entry = {};

  fs.readdirSync(path.join(__dirname, 'main-src', 'libs', 'recipes'))
    .forEach((fileName) => {
      entry[fileName.replace('.js', '')] = path.join(__dirname, 'main-src', 'libs', 'recipes', fileName);
    });

  return {
    mode: 'production',
    node: {
      global: false,
      __filename: false,
      __dirname: false,
    },
    externals,
    entry,
    target: 'web',
    output: {
      path: path.join(__dirname, 'build', 'recipes'),
      filename: '[name].js',
    },
    // devtool: 'source-map',
    plugins,
    // optimization: {
    //   minimize: false,
    // },
  };
};

module.exports = [getElectronMainConfig(), getPreloadScriptsConfig(), getRecipeConfig()];
