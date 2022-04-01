/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

/* eslint-disable no-param-reassign */
const path = require('path');

module.exports = {
  webpack: (config) => {
    config.target = 'electron-renderer';
    return config;
  },
  paths: (paths) => {
    paths.appSrc = path.join(__dirname, 'src');
    paths.appIndexJs = path.join(paths.appSrc, 'renderer', 'index.tsx');
    paths.appTypeDeclarations = path.join(paths.appSrc, 'renderer', 'react-app-env.d.ts');
    return paths;
  },
};
