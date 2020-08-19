const { BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

const { REACT_PATH } = require('../constants/paths');

let win;

const get = () => win;

const create = (id) => {
  global.editWorkspaceId = id;

  win = new BrowserWindow({
    backgroundColor: '#FFF',
    width: 420,
    height: 700,
    resizable: false,
    maximizable: false,
    minimizable: false,
    fullscreenable: false,
    autoHideMenuBar: false,
    show: false,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      webSecurity: !isDev,
      preload: path.join(__dirname, '..', 'preload', 'edit-workspace.js'),
    },
  });
  win.setMenuBarVisibility(false);

  win.on('closed', () => {
    win = null;
    global.editWorkspaceId = null;
  });

  win.once('ready-to-show', () => {
    win.show();
  });

  win.loadURL(REACT_PATH);
};

const show = (id) => {
  if (win == null) {
    create(id);
  } else if (id !== global.editWorkspaceId) {
    win.close();
    create(id);
  } else {
    win.show();
  }
};

module.exports = {
  get,
  create,
  show,
};
