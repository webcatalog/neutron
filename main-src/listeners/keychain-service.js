/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

/* https://github.com/minbrowser/min/blob/7749a35ea71a5f373c05e1d587b620a7a5f7c1fc/main/keychainService.js */

const { ipcMain } = require('electron');
const keytar = require('keytar');

const load = () => {
  ipcMain.handle('keychainGetPassword', (event, service, account) => keytar.getPassword(service, account));

  ipcMain.handle('keychainSetPassword', (event, service, account, password) => keytar.setPassword(service, account, password));

  ipcMain.handle('keychainDeletePassword', (event, service, account) => keytar.deletePassword(service, account));

  ipcMain.handle('keychainFindCredentials', (event, service) => keytar.findCredentials(service));

  ipcMain.handle('keychainFindPassword', (event, service) => keytar.setPassword(service));
};

module.exports = { load };
