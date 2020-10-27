const {
  ipcMain,
  nativeTheme,
} = require('electron');
const keytar = require('keytar');

const { getPreferences } = require('../libs/preferences');
const { getSystemPreferences } = require('../libs/system-preferences');
const { getWorkspaces } = require('../libs/workspaces');
const { getWorkspaceMetas } = require('../libs/workspace-metas');
const { getPauseNotificationsInfo } = require('../libs/notifications');

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

  ipcMain.handle('get-password', (e, service, account) => keytar.getPassword(service, account));
  ipcMain.handle('delete-password', (e, service, account) => keytar.deletePassword(service, account));
  ipcMain.handle('set-password', (e, service, account, password) => keytar.setPassword(service, account, password));
};

module.exports = loadInvokers;
