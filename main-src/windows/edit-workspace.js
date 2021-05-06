/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const { BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const contextMenu = require('electron-context-menu');

const { REACT_PATH } = require('../constants/paths');

let win;

const get = () => win;

const create = (id) => {
  global.editWorkspaceId = id;

  win = new BrowserWindow({
    backgroundColor: '#FFF',
    width: 420,
    height: 720,
    resizable: false,
    maximizable: false,
    minimizable: true,
    fullscreenable: false,
    show: false,
    frame: process.platform === 'darwin' || global.useSystemTitleBar,
    webPreferences: {
      enableRemoteModule: true,
      contextIsolation: false,
      nodeIntegration: true,
      webSecurity: !isDev,
      preload: path.join(__dirname, 'edit-workspace-preload.js'),
    },
  });
  win.setMenuBarVisibility(false);
  contextMenu({ window: win });

  win.on('closed', () => {
    win = null;
    global.editWorkspaceId = null;
  });

  win.once('ready-to-show', () => {
    win.show();
  });

  win.loadURL(REACT_PATH);
};

const show = (id) => {
  if (win == null) {
    create(id);
  } else if (id !== global.editWorkspaceId) {
    win.close();
    create(id);
  } else {
    win.show();
  }
};

const close = (id) => {
  if (!win) return;
  if (id) {
    if (id === global.editWorkspaceId) {
      win.close();
    }
  } else {
    win.close();
  }
};

module.exports = {
  close,
  get,
  create,
  show,
};
