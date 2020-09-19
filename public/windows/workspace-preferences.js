const { BrowserWindow } = require('electron');
const path = require('path');

const { REACT_PATH } = require('../constants/paths');

let win;

const get = () => win;

const create = (workspaceId) => {
  global.workspacePreferencesWorkspaceId = workspaceId;

  win = new BrowserWindow({
    backgroundColor: '#FFF',
    width: 760,
    height: 600,
    resizable: false,
    maximizable: false,
    minimizable: false,
    fullscreenable: false,
    autoHideMenuBar: false,
    show: false,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      preload: path.join(__dirname, '..', 'preload', 'workspace-preferences.js'),
    },
  });
  win.setMenuBarVisibility(false);

  win.on('closed', () => {
    win = null;
    global.workspacePreferencesWorkspaceId = null;
  });

  win.once('ready-to-show', () => {
    win.show();
  });

  win.loadURL(REACT_PATH);
};

const show = (workspaceId) => {
  if (win == null) {
    create(workspaceId);
  } else if (workspaceId !== global.workspacePreferencesWorkspaceId) {
    win.close();
    create(workspaceId);
  } else {
    win.show();
  }
};

module.exports = {
  get,
  create,
  show,
};
