/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const { BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const contextMenu = require('electron-context-menu');
const electronRemote = require('@electron/remote/main');
const Positioner = require('electron-positioner');

const { REACT_PATH } = require('../constants/paths');
const isMenubarBrowser = require('../libs/is-menubar-browser');

let win;
let positioner;

const get = () => win;

const create = () => {
  win = new BrowserWindow({
    width: 450,
    height: 600,
    resizable: false,
    maximizable: false,
    minimizable: true,
    fullscreenable: false,
    show: false,
    frame: !isMenubarBrowser() && (process.platform === 'darwin' || global.useSystemTitleBar),
    titleBarStyle: process.platform === 'win32' && !global.useSystemTitleBar ? 'hidden' : 'default',
    titleBarOverlay: global.useSystemWindowButtons,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      webSecurity: !isDev,
      preload: path.join(__dirname, 'add-workspace-preload.js'),
    },
  });
  electronRemote.enable(win.webContents);
  win.setMenuBarVisibility(false);
  contextMenu({ window: win });
  if (isMenubarBrowser()) {
    positioner = new Positioner(win);
  }

  win.on('closed', () => {
    win = null;
  });

  win.once('ready-to-show', () => {
    win.show();
  });

  win.loadURL(REACT_PATH);
};

const show = (trayBounds) => {
  if (win == null) {
    create();
  } else {
    win.show();
  }

  if (trayBounds && positioner) {
    positioner.move('trayCenter', trayBounds);
  }
};

module.exports = {
  get,
  create,
  show,
};
