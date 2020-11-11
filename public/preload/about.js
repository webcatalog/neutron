/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
window.mode = 'about';

require('./shared');

const path = require('path');

window.iconPath = path.join(__dirname, '..', 'icon.png')
  .replace('app.asar', 'app.asar.unpacked');
