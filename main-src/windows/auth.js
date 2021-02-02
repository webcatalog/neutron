/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const { BrowserWindow, ipcMain } = require('electron');
const path = require('path');

const { REACT_PATH } = require('../constants/paths');

const wins = {};
const emitted = {};

const get = (id) => wins[id];

const create = (id) => {
  emitted[id] = false;

  wins[id] = new BrowserWindow({
    backgroundColor: '#FFF',
    width: 400,
    height: 220,
    resizable: false,
    maximizable: false,
    minimizable: true,
    fullscreenable: false,
    frame: process.platform === 'darwin' || global.useSystemTitleBar,
    webPreferences: {
      enableRemoteModule: true,
      contextIsolation: false,
      nodeIntegration: true,
      preload: path.join(__dirname, 'auth-preload.js'),
    },
  });
  wins[id].setMenuBarVisibility(false);

  const identityValidationListener = (e, windowId, username, password) => {
    if (windowId !== wins[id].id) return;

    if (!emitted[id]) {
      emitted[id] = true;
      ipcMain.emit('continue-auth', null, id, true, username, password);
    }
    wins[id].close();
  };

  wins[id].on('closed', () => {
    if (!emitted[id]) {
      emitted[id] = true;
      ipcMain.emit('continue-auth', null, id, false);
    }
    delete wins[id];
    ipcMain.removeListener('request-validate-auth-identity', identityValidationListener);
  });

  ipcMain.on('request-validate-auth-identity', identityValidationListener);

  wins[id].once('ready-to-show', () => {
    wins[id].show();
  });

  wins[id].loadURL(REACT_PATH);
};

const show = (id) => {
  if (wins[id] == null) {
    create(id);
  } else {
    wins[id].show();
  }
};

module.exports = {
  get,
  create,
  show,
};
