const { BrowserWindow } = require('electron');
const path = require('path');

const { REACT_PATH } = require('../constants/paths');

let win;

const get = () => win;

const create = () => {
  win = new BrowserWindow({
    backgroundColor: '#FFF',
    width: 400,
    height: 170,
    resizable: false,
    maximizable: false,
    minimizable: false,
    fullscreenable: false,
    autoHideMenuBar: false,
    show: false,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      preload: path.join(__dirname, '..', 'preload', 'go-to-url.js'),
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

const show = (url) => {
  if (win == null) {
    create(url);
  } else {
    win.close();
    create(url);
  }
};

module.exports = {
  get,
  create,
  show,
};
