/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const { BrowserWindow } = require('electron');
const path = require('path');
const contextMenu = require('electron-context-menu');

const { REACT_PATH } = require('../constants/paths');

let win;

const get = () => win;

const create = (workspaceId) => {
  global.workspacePreferencesWorkspaceId = workspaceId;

  win = new BrowserWindow({
    backgroundColor: '#FFF',
    minWidth: 760,
    minHeight: 640,
    width: 860,
    height: 640,
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
      preload: path.join(__dirname, 'workspace-preferences-preload.js'),
    },
  });
  win.setMenuBarVisibility(false);
  contextMenu({ window: win });

  win.on('closed', () => {
    win = null;
    global.workspacePreferencesWorkspaceId = null;
  });

  win.once('ready-to-show', () => {
    win.show();
  });

  win.loadURL(REACT_PATH);
};

const show = (workspaceId) => {
  if (win == null) {
    create(workspaceId);
  } else if (workspaceId !== global.workspacePreferencesWorkspaceId) {
    win.once('closed', () => {
      create(workspaceId);
    });
    win.close();
  } else {
    win.show();
  }
};

const close = (id) => {
  if (!win) return;
  if (id) {
    if (id === global.workspacePreferencesWorkspaceId) {
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
