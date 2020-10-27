const { ipcMain } = require('electron');
const keytar = require('keytar');
const sendToAllWindows = require('./send-to-all-windows');

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
  global.locked = true;
  sendToAllWindows('set-locked', global.locked);
  ipcMain.emit('request-realign-active-workspace');
};

const unlockApp = (inputPassword) => {
  validateAppLockPasswordAsync(inputPassword)
    .then((isValid) => {
      if (!isValid) return;
      global.locked = false;
      sendToAllWindows('set-locked', global.locked);
      ipcMain.emit('request-realign-active-workspace');
    })
    // eslint-disable-next-line no-console
    .catch(console.log);
};

module.exports = {
  getAppLockStatusAsync,
  validateAppLockPasswordAsync,
  deleteAppLockPasswordAsync,
  setAppLockPasswordAsync,
  setAppLockTouchIdAsync,
  lockApp,
  unlockApp,
};
