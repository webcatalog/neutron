const { BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

const { REACT_PATH } = require('../constants/paths');

let win;

const get = () => win;

const create = () => {
  win = new BrowserWindow({
    backgroundColor: '#FFF',
    width: 400,
    height: 600,
    resizable: false,
    maximizable: false,
    minimizable: true,
    fullscreenable: false,
    autoHideMenuBar: false,
    show: false,
    frame: process.platform === 'darwin',
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      webSecurity: !isDev,
      preload: path.join(__dirname, '..', 'preload', 'notifications.js'),
    },
  });
  win.setMenuBarVisibility(false);

  win.on('closed', () => {
    win = null;
  });

  win.once('ready-to-show', () => {
    win.show();
  });

  win.loadURL(REACT_PATH);
};

const show = () => {
  if (win == null) {
    create();
  } else {
    win.show();
  }
};

module.exports = {
  get,
  create,
  show,
};
