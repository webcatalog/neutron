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
const { getWorkspaceMetas } = require('../libs/workspace-metas');
const { getPauseNotificationsInfo } = require('../libs/notifications');

const {
  getAppLockStatusAsync,
  validateAppLockPasswordAsync,
  deleteAppLockPasswordAsync,
  setAppLockPasswordAsync,
  setAppLockTouchIdAsync,
} = require('../libs/app-lock');

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
};

module.exports = loadInvokers;
