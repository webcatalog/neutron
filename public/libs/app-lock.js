const { ipcMain, systemPreferences } = require('electron');
const keytar = require('keytar');
const sendToAllWindows = require('./send-to-all-windows');
const { createMenu } = require('./menu');

const appJson = require('../app.json');

const getAppLockStatusAsync = async () => {
  const currentPassword = await keytar.getPassword(appJson.id, 'app-lock-password');
  const useTouchId = process.platform === 'darwin'
    ? await keytar.getPassword(appJson.id, 'app-lock-touch-id') === '1'
    : false;
  return {
    useTouchId,
    hasPassword: Boolean(currentPassword),
  };
};

const validateAppLockPasswordAsync = async (inputPassword) => {
  const currentPassword = await keytar.getPassword(appJson.id, 'app-lock-password');
  if (currentPassword && inputPassword !== currentPassword) return false;
  return true;
};

const deleteAppLockPasswordAsync = async (inputPassword) => {
  const validPassword = await validateAppLockPasswordAsync(inputPassword);
  if (!validPassword) return null;
  return keytar.deletePassword(appJson.id, 'app-lock-password');
};

const setAppLockPasswordAsync = async (inputPassword, newPassword) => {
  const validPassword = await validateAppLockPasswordAsync(inputPassword);
  if (!validPassword) return null;
  return keytar.setPassword(appJson.id, 'app-lock-password', newPassword);
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
  keytar.getPassword(appJson.id, 'app-lock-touch-id')
    .then((val) => {
      if (systemPreferences.canPromptTouchID() && val === '1') {
        return systemPreferences.promptTouchID('Unlock app');
      }
      return false;
    })
    .then((success) => {
      if (success) {
        global.locked = false;
        sendToAllWindows('set-locked', global.locked);
        ipcMain.emit('request-realign-active-workspace');
        createMenu();
      }
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
