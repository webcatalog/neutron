/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const {
  ipcMain,
} = require('electron');

const mainWindow = require('../../windows/main');

const {
  setPreference,
} = require('../preferences');

const {
  getWorkspaces,
} = require('../workspaces');

const getWorkspaceFriendlyName = require('../get-workspace-friendly-name');

const getViewSubmenu = () => {
  const workspaces = getWorkspaces();
  const hasWorkspaces = Object.keys(workspaces).length > 0;

  const handleZoomIn = (menuItem, browserWindow) => {
    // if item is called in popup window
    // open menu bar in the popup window instead
    if (browserWindow && browserWindow.isPopup) {
      const contents = browserWindow.webContents;
      contents.zoomFactor += 0.1;
      return;
    }

    const win = mainWindow.get();

    if (win != null) {
      const contents = win.getBrowserView().webContents;
      contents.zoomFactor += 0.1;
    }
  };

  return [
    {
      label: global.sidebar ? `Hide ${getWorkspaceFriendlyName()} Bar` : `Show ${getWorkspaceFriendlyName()} Bar`,
      accelerator: 'CmdOrCtrl+Alt+S',
      click: () => {
        setPreference('sidebar', !global.sidebar);
        ipcMain.emit('request-realign-active-workspace');
      },
      enabled: !global.locked,
    },
    {
      label: global.navigationBar ? 'Hide Navigation Bar' : 'Show Navigation Bar',
      accelerator: 'CmdOrCtrl+Alt+N',
      enabled: !global.locked && !(process.platform === 'linux' && global.attachToMenubar && !global.sidebar),
      click: () => {
        setPreference('navigationBar', !global.navigationBar);
        ipcMain.emit('request-realign-active-workspace');
      },
    },
    {
      label: global.titleBar ? 'Hide Title Bar' : 'Show Title Bar',
      accelerator: 'CmdOrCtrl+Alt+T',
      enabled: !global.locked && process.platform === 'darwin',
      visible: process.platform === 'darwin',
      click: () => {
        setPreference('titleBar', !global.titleBar);
        ipcMain.emit('request-realign-active-workspace');
      },
    },
    { type: 'separator' },
    { role: 'togglefullscreen' },
    {
      label: 'Actual Size',
      accelerator: 'CmdOrCtrl+0',
      click: (menuItem, browserWindow) => {
        // if item is called in popup window
        // open menu bar in the popup window instead
        if (browserWindow && browserWindow.isPopup) {
          const contents = browserWindow.webContents;
          contents.zoomFactor = 1;
          return;
        }

        const win = mainWindow.get();

        if (win != null) {
          const contents = win.getBrowserView().webContents;
          contents.zoomFactor = 1;
        }
      },
      enabled: !global.locked && hasWorkspaces,
    },
    // duplicate zooming in menuitem
    // as it's not posible to set multiple accelerators
    // https://github.com/webcatalog/webcatalog-app/issues/1015
    {
      label: 'Zoom In',
      accelerator: 'CmdOrCtrl+=',
      click: handleZoomIn,
      enabled: !global.locked && hasWorkspaces,
      visible: false,
    },
    {
      label: 'Zoom In',
      accelerator: 'CmdOrCtrl+Plus',
      click: handleZoomIn,
      enabled: !global.locked && hasWorkspaces,
    },
    {
      label: 'Zoom Out',
      accelerator: 'CmdOrCtrl+-',
      click: (menuItem, browserWindow) => {
        // if item is called in popup window
        // open menu bar in the popup window instead
        if (browserWindow && browserWindow.isPopup) {
          const contents = browserWindow.webContents;
          // // 'zoomFactor' must be a double greater than 0.0
          if (contents.zoomFactor.toFixed(1) !== '0.1') {
            contents.zoomFactor -= 0.1;
          }
          return;
        }

        const win = mainWindow.get();

        if (win != null) {
          const contents = win.getBrowserView().webContents;
          // 'zoomFactor' must be a double greater than 0.0
          if (contents.zoomFactor.toFixed(1) !== '0.1') {
            contents.zoomFactor -= 0.1;
          }
        }
      },
      enabled: !global.locked && hasWorkspaces,
    },
    { type: 'separator' },
    {
      label: 'Reload This Page',
      accelerator: 'CmdOrCtrl+R',
      click: (menuItem, browserWindow) => {
        // if item is called in popup window
        // open menu bar in the popup window instead
        if (browserWindow && browserWindow.isPopup) {
          browserWindow.webContents.reload();
          return;
        }

        const win = mainWindow.get();

        if (win != null) {
          win.getBrowserView().webContents.reload();
        }
      },
      enabled: !global.locked && hasWorkspaces,
    },
    { type: 'separator' },
    {
      label: 'Toggle Developer Tools',
      click: () => {
        const win = mainWindow.get();

        if (win != null) {
          win.getBrowserView().webContents.toggleDevTools();
        }
      },
      enabled: !global.locked && hasWorkspaces,
    },
  ];
};

module.exports = getViewSubmenu;
