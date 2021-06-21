/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
window.mode = 'preferences';

require('./shared-preload');

const path = require('path');

const iconPngPath = process.env.NODE_ENV === 'production'
  ? path.resolve(__dirname, 'icon.png').replace('app.asar', 'app.asar.unpacked')
  : path.resolve(__dirname, '..', 'public', 'icon.png');
window.iconPath = iconPngPath;
