/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const { BrowserWindow } = require('electron');
const path = require('path');
const contextMenu = require('electron-context-menu');

const { REACT_PATH } = require('../constants/paths');

let win;

const get = () => win;

const create = (url) => {
  global.incomingUrl = url;

  win = new BrowserWindow({
    backgroundColor: '#FFF',
    width: 400,
    height: 530,
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
      preload: path.join(__dirname, 'open-url-with-preload.js'),
    },
  });
  win.setMenuBarVisibility(false);
  contextMenu({ window: win });

  win.on('closed', () => {
    win = null;
  });

  win.once('ready-to-show', () => {
    win.show();
  });

  win.loadURL(REACT_PATH);
};

const show = (url) => {
  if (win == null) {
    create(url);
  } else {
    win.once('closed', () => {
      create(url);
    });
    win.close();
  }
};

module.exports = {
  get,
  create,
  show,
};
