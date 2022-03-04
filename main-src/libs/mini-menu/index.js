/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const { app, ipcMain, Menu } = require('electron');

const { setPreference, getPreference } = require('../preferences');
const isMas = require('../is-mas');
const isSnap = require('../is-snap');
const isAppx = require('../is-appx');
const formatBytes = require('../format-bytes');
const isStandalone = require('../is-standalone');
const isMenubarBrowser = require('../is-menubar-browser');
const appJson = require('../../constants/app-json');

const get = () => {
  const muteApp = getPreference('muteApp');
  const lockMenuItems = Boolean(global.appLock) && !global.locked ? [
    {
      label: 'Lock',
      click: () => ipcMain.emit('request-lock-app'),
    },
  ] : [];

  const updaterEnabled = !isMas() && !isSnap() && !isAppx();
  const updaterMenuItem = {
    label: 'Check for Updates...',
    click: () => ipcMain.emit('request-check-for-updates'),
    visible: updaterEnabled,
  };
  if (updaterEnabled && isStandalone()) {
    if (global.updaterObj && global.updaterObj.status === 'update-downloaded') {
      updaterMenuItem.label = 'Restart to Apply Updates...';
    } else if (global.updaterObj && global.updaterObj.status === 'update-available') {
      updaterMenuItem.label = 'Downloading Updates...';
      updaterMenuItem.enabled = false;
    } else if (global.updaterObj && global.updaterObj.status === 'download-progress') {
      const { transferred, total, bytesPerSecond } = global.updaterObj.info;
      updaterMenuItem.label = `Downloading Updates (${formatBytes(transferred)}/${formatBytes(total)} at ${formatBytes(bytesPerSecond)}/s)...`;
      updaterMenuItem.enabled = false;
    } else if (global.updaterObj && global.updaterObj.status === 'checking-for-update') {
      updaterMenuItem.label = 'Checking for Updates...';
      updaterMenuItem.enabled = false;
    }
  }

  const trayContextMenu = Menu.buildFromTemplate([
    {
      label: isMenubarBrowser() ? 'Global Preferences...' : 'Preferences...',
      click: () => ipcMain.emit('request-show-preferences-window'),
    },
    {
      type: 'separator',
    },
    ...lockMenuItems,
    {
      label: 'Notifications...',
      click: () => ipcMain.emit('request-show-notifications-window'),
      enabled: !global.locked,
    },
    {
      label: muteApp ? 'Unmute' : 'Mute',
      click: () => setPreference('muteApp', !muteApp),
      enabled: !global.locked,
    },
    {
      type: 'separator',
    },
    {
      label: `About ${appJson.name}`,
      click: () => ipcMain.emit('request-show-preferences-window', null, 'about'),
    },
    updaterMenuItem,
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        app.quit();
      },
    },
  ]);

  return trayContextMenu;
};

// https://dev.to/saisandeepvaddi/creating-a-custom-menu-bar-in-electron-1pi3
// Register an event listener.
// When ipcRenderer sends mouse click co-ordinates, show menu at that position.
const show = (window, x, y) => {
  get().popup({
    window,
    x,
    y,
  });
};

module.exports = {
  get,
  show,
};
