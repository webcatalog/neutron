/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const path = require('path');
const fs = require('fs-extra');

const appJsonPath = process.env.NODE_ENV === 'production'
  ? path.resolve(__dirname, 'app.json')
  : path.resolve(__dirname, '..', '..', 'public', 'app.json');

const appJson = fs.readJsonSync(appJsonPath);

module.exports = appJson;
