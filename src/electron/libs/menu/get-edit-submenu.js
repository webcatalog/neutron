/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const mainWindow = require('../../windows/main');

const getViewBounds = require('../get-view-bounds');

const {
  getWorkspaces,
} = require('../workspaces');

const getEditSubmenu = () => {
  const workspaces = getWorkspaces();
  const hasWorkspaces = Object.keys(workspaces).length > 0;

  return [
    { role: 'undo' },
    { role: 'redo' },
    { type: 'separator' },
    { role: 'cut' },
    { role: 'copy' },
    { role: 'paste' },
    {
      role: 'pasteandmatchstyle',
      // by default, it's 'Alt+Shift+CmdOrCtrl+V'
      accelerator: 'Shift+CmdOrCtrl+V',
    },
    { role: 'delete' },
    { role: 'selectall' },
    { type: 'separator' },
    {
      label: 'Find',
      accelerator: 'CmdOrCtrl+F',
      click: () => {
        const win = mainWindow.get();
        if (win) {
          win.webContents.focus();

          win.send('open-find-in-page');

          const contentSize = win.getContentSize();
          const view = win.getBrowserView();

          view.setBounds(getViewBounds(contentSize, true));
        }
      },
      enabled: !global.locked && hasWorkspaces,
    },
    {
      label: 'Find Next',
      accelerator: 'CmdOrCtrl+G',
      click: () => {
        const win = mainWindow.get();
        win.send('request-back-find-in-page', true);
      },
      enabled: !global.locked && hasWorkspaces,
    },
    {
      label: 'Find Previous',
      accelerator: 'Shift+CmdOrCtrl+G',
      click: () => {
        const win = mainWindow.get();
        win.send('request-back-find-in-page', false);
      },
      enabled: !global.locked && hasWorkspaces,
    },
  ];
};

module.exports = getEditSubmenu;
