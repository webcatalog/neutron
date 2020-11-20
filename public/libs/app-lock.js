/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const { ipcMain, systemPreferences } = require('electron');
const { captureException } = require('@sentry/electron');
const keytar = require('keytar');

const sendToAllWindows = require('./send-to-all-windows');
const { createMenu } = require('./menu');

const appJson = require('../app.json');

const getAppLockStatusAsync = async () => {
  try {
    const currentPassword = await keytar.getPassword(appJson.id, 'app-lock-password');
    const useTouchId = process.platform === 'darwin' && systemPreferences.canPromptTouchID()
      ? await keytar.getPassword(appJson.id, 'app-lock-touch-id') === '1'
      : false;
    return {
      supported: false,
      useTouchId,
      hasPassword: Boolean(currentPassword),
    };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    captureException(e);
    // keytar might fail on Linux system without libsecret installed
    return {
      supported: false,
      useTouchId: false,
      hasPassword: false,
    };
  }
};

const validateAppLockPasswordAsync = async (inputPassword) => {
  const currentPassword = await keytar.getPassword(appJson.id, 'app-lock-password');
  if (currentPassword && inputPassword !== currentPassword) return false;
  return true;
};

const deleteAppLockPasswordAsync = async (inputPassword) => {
  const validPassword = await validateAppLockPasswordAsync(inputPassword);
  if (!validPassword) return null;
  return keytar.deletePassword(appJson.id, 'app-lock-password')
    .then(() => {
      global.appLock = false;
      ipcMain.emit('request-realign-active-workspace');
      createMenu();
    });
};

const setAppLockPasswordAsync = async (inputPassword, newPassword) => {
  const validPassword = await validateAppLockPasswordAsync(inputPassword);
  if (!validPassword) return null;
  return keytar.setPassword(appJson.id, 'app-lock-password', newPassword)
    .then(() => {
      global.appLock = true;
      ipcMain.emit('request-realign-active-workspace');
      createMenu();
    });
};

const setAppLockTouchIdAsync = async (inputPassword, useTouchId) => {
  const validPassword = await validateAppLockPasswordAsync(inputPassword);
  if (!validPassword) return null;
  if (useTouchId) {
    return keytar.setPassword(appJson.id, 'app-lock-touch-id', '1');
  }
  return keytar.deletePassword(appJson.id, 'app-lock-touch-id');
};

const lockApp = () => {
  getAppLockStatusAsync()
    .then((status) => {
      if (status.hasPassword) {
        global.locked = true;
        sendToAllWindows('set-locked', global.locked);
        ipcMain.emit('request-realign-active-workspace');
        createMenu();
      }
    })
    // eslint-disable-next-line no-console
    .catch(console.log);
};

const unlockApp = (inputPassword) => {
  if (!global.locked) return;
  validateAppLockPasswordAsync(inputPassword)
    .then((isValid) => {
      if (!isValid) return;
      global.locked = false;
      sendToAllWindows('set-locked', global.locked);
      ipcMain.emit('request-realign-active-workspace');
      createMenu();
    })
    // eslint-disable-next-line no-console
    .catch(console.log);
};

const unlockAppUsingTouchId = () => {
  if (process.platform !== 'darwin') return;
  if (!global.locked) return;
  keytar.getPassword(appJson.id, 'app-lock-touch-id')
    .then((val) => {
      if (systemPreferences.canPromptTouchID() && val === '1') {
        return systemPreferences.promptTouchID('Unlock app');
      }
      return false;
    })
    .then(() => {
      global.locked = false;
      sendToAllWindows('set-locked', global.locked);
      ipcMain.emit('request-realign-active-workspace');
      createMenu();
    })
    // eslint-disable-next-line no-console
    .catch(console.log);
};

module.exports = {
  deleteAppLockPasswordAsync,
  getAppLockStatusAsync,
  lockApp,
  setAppLockPasswordAsync,
  setAppLockTouchIdAsync,
  unlockApp,
  unlockAppUsingTouchId,
  validateAppLockPasswordAsync,
};
