/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const {
  BrowserWindow,
  ipcMain,
} = require('electron');
const path = require('path');
const contextMenu = require('electron-context-menu');

const { REACT_PATH } = require('../constants/paths');

let win;
let currentSender;

const get = () => win;

const create = (sender) => {
  currentSender = sender;

  win = new BrowserWindow({
    backgroundColor: '#FFF',
    width: 400,
    height: 600,
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
      preload: path.join(__dirname, 'display-media-preload.js'),
    },
  });
  win.setMenuBarVisibility(false);
  contextMenu({ window: win });

  const onClose = () => {
    if (sender && !sender.isDestroyed()) {
      sender.send('display-media-id-received', null);
    }
  };
  win.on('close', onClose);

  const onSelected = (e, displayMediaId) => {
    if (sender && !sender.isDestroyed()) {
      sender.send('display-media-id-received', displayMediaId);
    }
    ipcMain.removeListener('display-media-selected', onSelected);
    if (win) {
      win.removeListener('close', onClose);
      win.close();
    }
  };
  ipcMain.once('display-media-selected', onSelected);

  win.on('closed', () => {
    win = null;
  });

  win.once('ready-to-show', () => {
    win.show();
  });

  win.loadURL(REACT_PATH);
};

const show = (sender) => {
  // https://github.com/karaggeorge/mac-screen-capture-permissions/tree/master
  // https://nyrra33.com/2019/07/23/open-preference-pane-programmatically/

  // use node-mac-permissions
  // as Electron API doesn't support askForScreenCaptureAccess()
  // shell.openExternal('x-apple.systempreferences...') is not sufficient as it doesn't ensure
  // the app is added to app list in system pref
  if (process.platform === 'darwin') {
    // eslint-disable-next-line global-require
    const permissions = require('node-mac-permissions');
    const authStatus = permissions.getAuthStatus('screen');
    if (authStatus === 'denied' || authStatus === 'restricted') {
      permissions.askForScreenCaptureAccess();
      return;
    }
  }

  if (win == null) {
    create(sender);
  } else if (sender !== currentSender) {
    win.close();
    create(sender);
  } else {
    win.show();
  }
};

module.exports = {
  get,
  create,
  show,
};
