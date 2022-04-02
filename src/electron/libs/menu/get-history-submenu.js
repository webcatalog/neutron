/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const {
  clipboard,
  ipcMain,
} = require('electron');

const goToUrlWindow = require('../../windows/go-to-url');
const mainWindow = require('../../windows/main');

const {
  getWorkspaces,
} = require('../workspaces');

const getHistorySubmenu = () => {
  const workspaces = getWorkspaces();
  const hasWorkspaces = Object.keys(workspaces).length > 0;

  return [
    {
      label: 'Home',
      accelerator: process.platform === 'darwin' ? 'Shift+CmdOrCtrl+H' : 'Alt+Home',
      click: () => ipcMain.emit('request-go-home'),
      enabled: !global.locked && hasWorkspaces,
    },
    {
      label: 'Back',
      accelerator: process.platform === 'darwin' ? 'CmdOrCtrl+[' : 'Alt+Left',
      click: (menuItem, browserWindow) => {
        // if back is called in popup window
        // navigate in the popup window instead
        if (browserWindow && browserWindow.isPopup) {
          browserWindow.webContents.goBack();
          return;
        }
        ipcMain.emit('request-go-back');
      },
      enabled: !global.locked && hasWorkspaces,
    },
    {
      label: 'Forward',
      accelerator: process.platform === 'darwin' ? 'CmdOrCtrl+]' : 'Alt+Right',
      click: (menuItem, browserWindow) => {
        // if back is called in popup window
        // navigate in the popup window instead
        if (browserWindow && browserWindow.isPopup) {
          browserWindow.webContents.goBack();
          return;
        }
        ipcMain.emit('request-go-forward');
      },
      enabled: !global.locked && hasWorkspaces,
    },
    { type: 'separator' },
    {
      label: global.navigationBar ? 'Open Location...' : 'Copy URL',
      accelerator: 'CmdOrCtrl+L',
      click: (menuItem, browserWindow) => {
        // if address bar is visible
        // focus on address bar instead of copy URL (same behavior as Chrome)
        if (global.navigationBar) {
          if (browserWindow) {
            browserWindow.webContents.focus();
            browserWindow.send('focus-on-address-bar');
          }
          return;
        }

        // if back is called in popup window
        // copy the popup window URL instead
        if (browserWindow && browserWindow.isPopup) {
          const url = browserWindow.webContents.getURL();
          clipboard.writeText(url);
          return;
        }

        const win = mainWindow.get();

        if (win != null) {
          const url = win.getBrowserView().webContents.getURL();
          clipboard.writeText(url);
        }
      },
      enabled: !global.locked && hasWorkspaces,
    },
    { type: 'separator' },
    {
      label: 'Go to URL...',
      accelerator: 'CmdOrCtrl+Shift+G',
      click: () => {
        goToUrlWindow.show();
      },
      enabled: !global.locked && hasWorkspaces,
    },
  ];
};

module.exports = getHistorySubmenu;
