/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const {
  Menu,
} = require('electron');

const appJson = require('../../constants/app-json');

const getWorkspacesSubmenu = require('./get-workspaces-submenu');
const getViewSubmenu = require('./get-view-submenu');
const getMainSubmenu = require('./get-main-submenu');
const getFileSubmenu = require('./get-file-submenu');
const getWorkspaceFriendlyName = require('../get-workspace-friendly-name');
const getAboutSubmenu = require('./get-about-submenu');
const getHelpSubmenu = require('./get-help-submenu');
const getWindowSubmenu = require('./get-window-submenu');
const getEditSubmenu = require('./get-edit-submenu');
const getHistorySubmenu = require('./get-history-submenu');

// DO NOT require('./workspace-views') here
// it will cause (node:42042) Warning: Accessing non-existent propertys
// of module exports inside circular dependency
// use ipcMain.emit instead

let menu;

const createMenu = async () => {
  const workspacesSubmenu = getWorkspacesSubmenu();
  const viewSubmenu = getViewSubmenu();
  const mainSubmenu = getMainSubmenu();
  const fileSubmenu = getFileSubmenu();
  const aboutSubmenu = getAboutSubmenu();
  const helpSubmenu = getHelpSubmenu();
  const windowSubmenu = getWindowSubmenu();
  const editSubmenu = getEditSubmenu();
  const historySubmenu = getHistorySubmenu();

  const template = process.platform === 'darwin' ? [
    {
      label: appJson.name,
      submenu: [
        ...aboutSubmenu,
        { type: 'separator' },
        ...mainSubmenu,
      ],
    },
    {
      label: 'File',
      submenu: fileSubmenu,
    },
    {
      label: 'Edit',
      submenu: editSubmenu,
    },
    {
      label: 'View',
      submenu: viewSubmenu,
    },
    {
      label: 'History',
      submenu: historySubmenu,
    },
    {
      label: getWorkspaceFriendlyName(true),
      submenu: workspacesSubmenu,
    },
    {
      role: 'window',
      submenu: windowSubmenu,
    },
    {
      role: 'help',
      submenu: helpSubmenu,
    },
  ] : [ // Windows is using different menu structure
    {
      label: 'File',
      submenu: [
        ...fileSubmenu,
        { type: 'separator' },
        ...mainSubmenu,
      ],
    },
    {
      label: 'Edit',
      submenu: editSubmenu,
    },
    {
      label: 'View',
      submenu: viewSubmenu,
    },
    {
      label: 'History',
      submenu: historySubmenu,
    },
    {
      label: getWorkspaceFriendlyName(true),
      submenu: workspacesSubmenu,
    },
    {
      role: 'window',
      submenu: windowSubmenu,
    },
    {
      role: 'help',
      submenu: [
        ...aboutSubmenu,
        { type: 'separator' },
        ...helpSubmenu,
      ],
    },
  ];

  menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};

// https://dev.to/saisandeepvaddi/creating-a-custom-menu-bar-in-electron-1pi3
// Register an event listener.
// When ipcRenderer sends mouse click co-ordinates, show menu at that position.
const showMenu = (window, x, y) => {
  if (!menu) return;
  menu.popup({
    window,
    x,
    y,
  });
};

module.exports = {
  createMenu,
  showMenu,
};
