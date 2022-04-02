/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const appJson = require('../../constants/app-json');

const mainWindow = require('../../windows/main');

const getWindowSubmenu = () => [
  { role: 'close' },
  { role: 'minimize' },
  // role: 'zoom' is only supported on macOS
  process.platform === 'darwin' ? {
    role: 'zoom',
  } : {
    label: 'Zoom',
    click: () => {
      const win = mainWindow.get();

      if (win != null) {
        win.maximize();
      }
    },
  },
  { type: 'separator' },
  { role: 'front' },
  {
    label: appJson.name,
    click: () => mainWindow.show(),
  },
];

module.exports = getWindowSubmenu;
