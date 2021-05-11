/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const {
  app,
  dialog,
  shell,
  BrowserWindow,
} = require('electron');
const { autoUpdater } = require('electron-updater');

const sendToAllWindows = require('./send-to-all-windows');
const { createMenu } = require('./menu');
const getUtmSource = require('./get-utm-source');

const appJson = require('../constants/app-json');

global.updateSilent = true;

global.updaterObj = {};

autoUpdater.on('checking-for-update', () => {
  global.updaterObj = {
    status: 'checking-for-update',
  };
  sendToAllWindows('update-updater', global.updaterObj);
  createMenu();
});

autoUpdater.on('update-available', (info) => {
  if (!global.updateSilent) {
    dialog.showMessageBox({
      title: 'An Update is Available',
      message: 'There is an available update. It is being downloaded. We will let you know when it is ready.',
      buttons: ['OK', 'What\'s New'],
      cancelId: 0,
      defaultId: 0,
    })
      .then(({ response }) => {
        if (response === 1) {
          const utmSource = getUtmSource();
          shell.openExternal(`https://${appJson.hostname}/release-notes?utm_source=${utmSource}`);
        }
      })
      .catch(console.log); // eslint-disable-line
    global.updateSilent = true;
  }

  global.updaterObj = {
    status: 'update-available',
    info,
  };
  sendToAllWindows('update-updater', global.updaterObj);
  createMenu();
});

autoUpdater.on('update-not-available', (info) => {
  if (!global.updateSilent) {
    dialog.showMessageBox({
      title: 'No Updates',
      message: 'There are currently no updates available.',
      buttons: ['OK'],
      cancelId: 0,
      defaultId: 0,
    }).catch(console.log); // eslint-disable-line
    global.updateSilent = true;
  }

  global.updaterObj = {
    status: 'update-not-available',
    info,
  };
  sendToAllWindows('update-updater', global.updaterObj);
  createMenu();
});

autoUpdater.on('error', (err) => {
  if (!global.updateSilent) {
    dialog.showMessageBox({
      title: 'Failed to Check for Updates',
      message: 'Failed to check for updates. Please check your Internet connection.',
      buttons: ['OK'],
      cancelId: 0,
      defaultId: 0,
    }).catch(console.log); // eslint-disable-line
    global.updateSilent = true;
  }

  sendToAllWindows('log', err);
  global.updaterObj = {
    status: 'error',
    info: err,
  };
  sendToAllWindows('update-updater', global.updaterObj);
  createMenu();
});

autoUpdater.on('update-cancelled', () => {
  global.updaterObj = {
    status: 'update-cancelled',
  };
  sendToAllWindows('update-updater', global.updaterObj);
  createMenu();
});

autoUpdater.on('download-progress', (progressObj) => {
  global.updaterObj = {
    status: 'download-progress',
    info: progressObj,
  };
  sendToAllWindows('update-updater', global.updaterObj);
  createMenu();
});

autoUpdater.on('update-downloaded', (info) => {
  global.updaterObj = {
    status: 'update-downloaded',
    info,
  };
  sendToAllWindows('update-updater', global.updaterObj);
  createMenu();

  const dialogOpts = {
    type: 'info',
    buttons: ['Restart', 'Later', 'What\'s New'],
    title: 'Application Update',
    detail: `A new version (${info.version}) has been downloaded. Restart the application to apply the updates.`,
    cancelId: 1,
  };

  dialog.showMessageBox(dialogOpts)
    .then(({ response }) => {
      if (response === 2) {
        const utmSource = getUtmSource();
        shell.openExternal(`https://${appJson.hostname}/release-notes?utm_source=${utmSource}`);
      } else if (response === 0) {
        // Fix autoUpdater.quitAndInstall() does not quit immediately
        // https://github.com/electron/electron/issues/3583
        // https://github.com/electron-userland/electron-builder/issues/1604
        setImmediate(() => {
          app.removeAllListeners('window-all-closed');
          const wins = BrowserWindow.getAllWindows();
          wins.forEach((win) => {
            // https://github.com/electron-userland/electron-builder/issues/1604#issuecomment-372091881
            win.removeAllListeners('close');
            win.close();
          });
          autoUpdater.quitAndInstall(false);
        });
      }
    })
    .catch(console.log); // eslint-disable-line
});
