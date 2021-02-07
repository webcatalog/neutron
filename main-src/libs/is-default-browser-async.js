/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const {
  app,
} = require('electron');
const regedit = require('regedit');

const isWindows10 = require('./is-windows-10');

const appJson = require('../constants/app-json');

const isDefaultBrowserAsync = () => new Promise((resolve) => {
  // Electron protocol API doesn't work with Windows 10
  // So check with regedit
  if (isWindows10()) {
  // https://stackoverflow.com/questions/32354861/how-to-find-the-default-browser-via-the-registry-on-windows-10
    const protocolName = 'http'; // https works as well
    const userChoicePath = `HKCU\\SOFTWARE\\Microsoft\\Windows\\Shell\\Associations\\URLAssociations\\${protocolName}\\UserChoice`;
    regedit.list([userChoicePath], (err, result) => {
      try {
        resolve(!err && result[userChoicePath].values.ProgId.value === appJson.id);
      } catch (tryErr) {
        // eslint-disable-next-line no-console
        console.log(tryErr);
        resolve(false);
      }
    });
    return;
  }

  resolve(app.isDefaultProtocolClient('http'));
});

module.exports = isDefaultBrowserAsync;
