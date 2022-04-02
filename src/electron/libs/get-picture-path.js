/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const { app } = require('electron');
const path = require('path');

const getPicturePath = (pictureId, folderName = 'pictures') => path.join(app.getPath('userData'), folderName, `${pictureId}.png`);

module.exports = getPicturePath;
