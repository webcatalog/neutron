/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const mainWindow = require('../../windows/main');

const {
  getWorkspaces,
} = require('../workspaces');

const getFileSubmenu = () => {
  const workspaces = getWorkspaces();
  const hasWorkspaces = Object.keys(workspaces).length > 0;

  const submenu = [
    {
      label: 'Print...',
      accelerator: 'CmdOrCtrl+P',
      click: () => {
        const win = mainWindow.get();

        if (win != null) {
          const contents = win.getBrowserView().webContents;
          contents.send('request-print');
        }
      },
      enabled: !global.locked && hasWorkspaces,
    },
  ];

  if (process.platform === 'darwin') {
    submenu.unshift({
      type: 'separator',
    });
    submenu.unshift({
      role: 'shareMenu',
      sharingItem: {},
    });

    if (!global.locked && hasWorkspaces) {
      try {
        const win = mainWindow.get();
        if (win) {
          const view = win.getBrowserView();
          if (view && view.webContents) {
            const url = view.webContents.getURL();
            if (url) {
              submenu[1] = {
                type: 'separator',
              };
              submenu[0] = {
                role: 'shareMenu',
                sharingItem: {
                  urls: [url],
                },
              };
            }
          }
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
      }
    }
  }

  return submenu;
};

module.exports = getFileSubmenu;
