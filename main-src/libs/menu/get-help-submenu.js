/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const {
  shell,
} = require('electron');

const appJson = require('../../constants/app-json');

const isAppx = require('../is-appx');
const isMas = require('../is-mas');
const getUtmSource = require('../get-utm-source');

const isStandalone = require('../is-standalone');

// DO NOT require('./workspace-views') here
// it will cause (node:42042) Warning: Accessing non-existent propertys
// of module exports inside circular dependency
// use ipcMain.emit instead

const getHelpSubmenu = () => {
  const utmSource = getUtmSource();

  if (isAppx() || isMas() || isStandalone()) {
    return [
      {
        label: 'Help',
        click: () => {
          if (appJson.hostname) {
            return shell.openExternal(`https://${appJson.hostname}/help?utm_source=${utmSource}`);
          }
          return shell.openExternal(`https://webcatalog.io/contact/?utm_source=${utmSource}`);
        },
      },
      {
        label: 'Website',
        click: () => {
          if (appJson.hostname) {
            return shell.openExternal(`https://${appJson.hostname}?utm_source=${utmSource}`);
          }
          return shell.openExternal(`https://webcatalog.io?utm_source=${utmSource}`);
        },
      },
    ];
  }
  return [
    {
      label: 'WebCatalog Help',
      click: () => shell.openExternal(`https://docs.webcatalog.io?utm_source=${utmSource}`),
    },
    {
      label: 'WebCatalog Website',
      click: () => shell.openExternal(`https://webcatalog.io/webcatalog/?utm_source=${utmSource}`),
    },
  ];
};

module.exports = getHelpSubmenu;
