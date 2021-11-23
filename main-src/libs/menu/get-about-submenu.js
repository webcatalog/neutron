/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const {
  ipcMain,
} = require('electron');

const appJson = require('../../constants/app-json');

const isAppx = require('../is-appx');
const isMas = require('../is-mas');
const {
  getPreference,
} = require('../preferences');
const formatBytes = require('../format-bytes');

const isStandalone = require('../is-standalone');
const isSnap = require('../is-snap');

const getAboutSubmenu = () => {
  const { registered } = appJson;

  const licensingMenuItems = (() => {
    if (isAppx() || isMas()) {
      return [];
    }

    if (isStandalone()) {
      const standaloneRegistered = getPreference('standaloneRegistered');
      return [
        { type: 'separator' },
        {
          label: standaloneRegistered ? `${appJson.name} Plus` : `${appJson.name} Basic`,
          enabled: false,
          click: null,
        },
        {
          label: 'Upgrade...',
          visible: !standaloneRegistered,
          click: standaloneRegistered ? null : () => ipcMain.emit('request-show-require-license-dialog'),
        },
      ];
    }

    return [
      { type: 'separator' },
      {
        label: registered ? 'WebCatalog Lifetime' : 'WebCatalog Basic',
        enabled: false,
        click: null,
      },
      {
        label: 'Upgrade...',
        visible: !registered,
        click: registered ? null : () => ipcMain.emit('request-show-require-license-dialog'),
      },
    ];
  })();

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

  const submenu = [
    {
      label: `About ${appJson.name}`,
      click: () => ipcMain.emit('request-show-preferences-window', null, 'about'),
    },
    updaterMenuItem,
    {
      type: 'separator',
      visible: updaterEnabled,
    },
    ...licensingMenuItems,
  ];

  return submenu;
};

module.exports = getAboutSubmenu;
