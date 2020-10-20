const { BrowserWindow } = require('electron');
const path = require('path');

const { REACT_PATH } = require('../constants/paths');

let win;

const get = () => win;

const create = (scrollTo) => {
  global.preferencesScrollTo = scrollTo;

  win = new BrowserWindow({
    backgroundColor: '#FFF',
    width: 760,
    height: 600,
    resizable: false,
    maximizable: false,
    minimizable: true,
    fullscreenable: false,
    show: false,
    frame: process.platform === 'darwin',
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      preload: path.join(__dirname, '..', 'preload', 'preferences.js'),
    },
  });

  win.on('closed', () => {
    win = null;
    global.preferencesScrollTo = null;
  });

  win.once('ready-to-show', () => {
    win.show();
  });

  win.loadURL(REACT_PATH);
};

const show = (scrollTo) => {
  if (win == null) {
    create(scrollTo);
  } else if (scrollTo !== global.preferencesScrollTo) {
    win.close();
    create(scrollTo);
  } else {
    win.show();
  }
};

module.exports = {
  get,
  create,
  show,
};
