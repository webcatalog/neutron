/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const {
  ipcMain,
} = require('electron');

const {
  setPreference,
  getPreference,
} = require('../preferences');

const getMainSubmenu = () => {
  const macMenuItems = [
    { type: 'separator' },
    { role: 'services', submenu: [] },
    { type: 'separator' },
    { role: 'hide' },
    { role: 'hideothers' },
    { role: 'unhide' },
  ];

  const lockMenuItems = Boolean(global.appLock) && !global.locked ? [
    {
      type: 'separator',
    },
    {
      label: 'Lock',
      click: () => ipcMain.emit('request-lock-app'),
    },
    { type: 'separator' },
  ] : [];

  const muteApp = getPreference('muteApp');

  const submenu = [
    ...lockMenuItems,
    {
      label: 'Preferences...',
      accelerator: 'CmdOrCtrl+,',
      click: () => ipcMain.emit('request-show-preferences-window'),
      enabled: !global.locked,
    },
    { type: 'separator' },
    {
      label: 'Notifications...',
      click: () => ipcMain.emit('request-show-notifications-window'),
      accelerator: 'CmdOrCtrl+Shift+N',
      enabled: !global.locked,
    },
    { type: 'separator' },
    {
      label: muteApp ? 'Unmute' : 'Mute',
      click: () => setPreference('muteApp', !muteApp),
      enabled: !global.locked,
    },
    { type: 'separator' },
    {
      label: 'Clear Browsing Data...',
      accelerator: 'CmdOrCtrl+Shift+Delete',
      click: () => ipcMain.emit('request-clear-browsing-data'),
      enabled: !global.locked,
    },
    ...macMenuItems,
    { type: 'separator' },
    { role: 'quit' },
  ];

  return submenu;
};

module.exports = getMainSubmenu;
