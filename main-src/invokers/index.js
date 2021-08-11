/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const {
  ipcMain,
  nativeTheme,
} = require('electron');

const { getPreferences } = require('../libs/preferences');
const { getSystemPreferences } = require('../libs/system-preferences');
const { getWorkspaces, setWorkspacePictureAsync } = require('../libs/workspaces');
const {
  getWorkspaceMetas,
} = require('../libs/workspace-metas');
const {
  setWorkspaceBadgeCount,
} = require('../libs/workspace-badges');
const { getPauseNotificationsInfo } = require('../libs/notifications');

const {
  getAppLockStatusAsync,
  validateAppLockPasswordAsync,
  deleteAppLockPasswordAsync,
  setAppLockPasswordAsync,
  setAppLockTouchIdAsync,
} = require('../libs/app-lock');

const isDefaultBrowserAsync = require('../libs/is-default-browser-async');
const isDefaultMailClientAsync = require('../libs/is-default-mail-client-async');
const isDefaultCalendarAppAsync = require('../libs/is-default-calendar-app-async');

const getExtensionFromProfile = require('../libs/extensions/get-extensions-from-profile');
const getExtensionSources = require('../libs/extensions/get-extension-sources');

const getIapFormattedPriceAsync = require('../libs/get-iap-formatted-price-async');

const appJson = require('../constants/app-json');

const loadInvokers = () => {
  ipcMain.handle('get-react-initial-state', () => {
    const workspaces = getWorkspaces();
    const activeWorkspace = Object.values(workspaces)
      .find((workspace) => workspace.active);

    const initialState = {
      preferences: getPreferences(),
      systemPreferences: getSystemPreferences(),
      workspaces: {
        activeWorkspaceId: activeWorkspace ? activeWorkspace.id : null,
        workspaces,
      },
      workspaceMetas: getWorkspaceMetas(),
      notifications: {
        pauseNotificationsInfo: getPauseNotificationsInfo(),
      },
      general: {
        shouldUseDarkColors: nativeTheme.shouldUseDarkColors,
        locked: global.locked,
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
    setWorkspaceBadgeCount(e.sender.workspaceId, num);
  });
  // END for Browser

  ipcMain.handle('is-default-browser', () => isDefaultBrowserAsync());
  ipcMain.handle('is-default-mail-client', () => isDefaultMailClientAsync());
  ipcMain.handle('is-default-calendar-app', () => isDefaultCalendarAppAsync());

  ipcMain.handle('get-iap-formatted-price', (e, productIdentifier) => getIapFormattedPriceAsync(productIdentifier));

  ipcMain.handle('get-app-json', () => appJson);

  ipcMain.handle('get-extensions-from-profile', (e, browserId, profileDirName) => getExtensionFromProfile(browserId, profileDirName));
  ipcMain.handle('get-extension-sources', () => getExtensionSources());

  ipcMain.handle('get-permission-auth-status', (e, authType) => {
    if (process.platform === 'darwin') {
      // eslint-disable-next-line global-require
      const permissions = require('node-mac-permissions');
      return permissions.getAuthStatus(authType);
    }
    return 'denied';
  });
  ipcMain.handle('ask-for-permission', (e, authType) => {
    // Returns Promise<String> - Whether or not the
    // request succeeded or failed; can be authorized or denied.
    if (process.platform === 'darwin') {
      // eslint-disable-next-line global-require
      const permissions = require('node-mac-permissions');
      if (authType === 'camera') {
        return permissions.askForCameraAccess()
          .catch(() => 'rejected');
      }
      if (authType === 'microphone') {
        return permissions.askForMicrophoneAccess()
          .catch(() => 'rejected');
      }
    }
    return Promise.resolve('rejected');
  });

  ipcMain.handle('set-workspace-picture', (e, id, imgPath) => setWorkspacePictureAsync(id, imgPath));
};

module.exports = loadInvokers;
