/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const { BrowserWindow } = require('electron');
const path = require('path');
const contextMenu = require('electron-context-menu');

const { REACT_PATH } = require('../constants/paths');

let win;

const get = () => win;

const create = (scrollTo) => {
  global.preferencesScrollTo = scrollTo;

  win = new BrowserWindow({
    backgroundColor: '#FFF',
    minWidth: 760,
    minHeight: 640,
    width: 1024,
    height: 768,
    resizable: true,
    maximizable: true,
    minimizable: true,
    fullscreenable: false,
    show: false,
    frame: process.platform === 'darwin' || global.useSystemTitleBar,
    webPreferences: {
      enableRemoteModule: true,
      contextIsolation: false,
      nodeIntegration: true,
      webSecurity: process.env.NODE_ENV === 'production',
      preload: path.join(__dirname, 'preferences-preload.js'),
    },
  });
  win.setMenuBarVisibility(false);
  contextMenu({ window: win });

  win.on('closed', () => {
    win = null;
    global.preferencesScrollTo = null;
  });

  win.once('ready-to-show', () => {
    win.show();
  });

  win.loadURL(REACT_PATH);
};

const show = (scrollTo) => {
  if (win == null) {
    create(scrollTo);
  } else if (scrollTo) {
    win.once('closed', () => {
      create(scrollTo);
    });
    win.close();
  } else {
    win.show();
  }
};

module.exports = {
  get,
  create,
  show,
};
