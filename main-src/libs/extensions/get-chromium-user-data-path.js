/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const path = require('path');
const { app } = require('electron');

const getChromiumUserDataPath = (browserId) => {
  // https://stackoverflow.com/a/14544700/5522263
  const chromiumUserDataPath = {
    brave: {
      darwin: path.join(app.getPath('home'), 'Library', 'Application Support', 'BraveSoftware', 'Brave-Browser'),
    },
    chrome: {
      darwin: path.join(app.getPath('home'), 'Library', 'Application Support', 'Google', 'Chrome'),
      win32: path.join(app.getPath('home'), 'AppData', 'Local', 'Google', 'Chrome', 'User Data'),
      linux: path.join(app.getPath('appData'), 'google-chrome'),
    },
    chromium: {
      darwin: path.join(app.getPath('home'), 'Library', 'Application Support', 'Chromium'),
    },
    edge: {
      darwin: path.join(app.getPath('home'), 'Library', 'Application Support', 'Microsoft Edge'),
      win32: path.join(app.getPath('home'), 'AppData', 'Local', 'Microsoft', 'Edge', 'User Data'),
      linux: path.join(app.getPath('appData'), 'microsoft-edge'),
    },
    vivaldi: {
      darwin: path.join(app.getPath('home'), 'Library', 'Application Support', 'Vivaldi'),
    },
  };

  return chromiumUserDataPath[browserId][process.platform];
};

module.exports = getChromiumUserDataPath;
