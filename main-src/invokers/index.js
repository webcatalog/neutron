/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const {
  ipcMain,
  nativeTheme,
} = require('electron');

const { getPreferences } = require('../libs/preferences');
const { getSystemPreferences } = require('../libs/system-preferences');
const { getWorkspaces } = require('../libs/workspaces');
const {
  getWorkspaceMetas,
  setWorkspaceBadgeCount,
} = require('../libs/workspace-metas');
const { getPauseNotificationsInfo } = require('../libs/notifications');
const mainWindow = require('../windows/main');

const {
  getAppLockStatusAsync,
  validateAppLockPasswordAsync,
  deleteAppLockPasswordAsync,
  setAppLockPasswordAsync,
  setAppLockTouchIdAsync,
} = require('../libs/app-lock');

const isDefaultBrowserAsync = require('../libs/is-default-browser-async');
const isDefaultMailClientAsync = require('../libs/is-default-mail-client-async');

const loadInvokers = () => {
  ipcMain.handle('get-react-initial-state', () => {
    const initialState = {
      preferences: getPreferences(),
      systemPreferences: getSystemPreferences(),
      workspaces: getWorkspaces(),
      workspaceMetas: getWorkspaceMetas(),
      notifications: {
        pauseNotificationsInfo: getPauseNotificationsInfo(),
      },
      general: {
        shouldUseDarkColors: nativeTheme.shouldUseDarkColors,
      },
    };
    return Promise.resolve(initialState);
  });

  ipcMain.handle('get-app-lock-status', () => getAppLockStatusAsync());
  ipcMain.handle('validate-app-lock-password', async (e, inputPassword) => validateAppLockPasswordAsync(inputPassword));
  ipcMain.handle('delete-app-lock-password', async (e, inputPassword) => deleteAppLockPasswordAsync(inputPassword));
  ipcMain.handle('set-app-lock-password', async (e, inputPassword, newPassword) => setAppLockPasswordAsync(inputPassword, newPassword));
  ipcMain.handle('set-app-lock-touch-id', async (e, inputPassword, touchId) => setAppLockTouchIdAsync(inputPassword, touchId));

  // START for BrowserView
  ipcMain.handle('get-web-contents-workspace-id', (e) => e.sender.workspaceId);
  ipcMain.handle('get-web-contents-is-focused', (e) => e.sender.isFocused());
  ipcMain.handle('flush-web-contents-app-data', (e) => {
    const { session } = e.sender;
    session.flushStorageData();
    session.clearStorageData({
      storages: ['appcache', 'serviceworkers', 'cachestorage', 'websql', 'indexdb'],
    });
  });
  ipcMain.handle('set-web-contents-badge', (e, num) => {
    e.sender.usePageTitle = false;
    setWorkspaceBadgeCount(e.sender.workspaceId, num, mainWindow.get());
  });
  // END for Browser

  ipcMain.handle('is-default-browser', () => isDefaultBrowserAsync());
  ipcMain.handle('is-default-mail-client', () => isDefaultMailClientAsync());
};

module.exports = loadInvokers;
