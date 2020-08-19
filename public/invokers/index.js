const {
  ipcMain,
  nativeTheme,
} = require('electron');

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
};

module.exports = loadInvokers;
