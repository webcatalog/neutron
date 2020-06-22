const { BrowserWindow, ipcMain } = require('electron');
const path = require('path');

const { REACT_PATH } = require('../constants/paths');

const wins = {};
const emitted = {};

const get = (id) => wins[id];

const create = (id) => {
  emitted[id] = false;

  wins[id] = new BrowserWindow({
    backgroundColor: '#FFF',
    width: 400,
    height: 220,
    resizable: false,
    maximizable: false,
    minimizable: false,
    fullscreenable: false,
    autoHideMenuBar: false,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, '..', 'preload', 'auth.js'),
    },
  });
  wins[id].setMenuBarVisibility(false);

  wins[id].loadURL(REACT_PATH);

  const identityValidationListener = (e, windowId, username, password) => {
    if (windowId !== wins[id].id) return;

    if (!emitted[id]) {
      emitted[id] = true;
      ipcMain.emit('continue-auth', null, id, true, username, password);
    }
    wins[id].close();
  };

  wins[id].on('closed', () => {
    if (!emitted[id]) {
      emitted[id] = true;
      ipcMain.emit('continue-auth', null, id, false);
    }
    delete wins[id];
    ipcMain.removeListener('request-validate-auth-identity', identityValidationListener);
  });

  ipcMain.on('request-validate-auth-identity', identityValidationListener);
};

const show = (id) => {
  if (wins[id] == null) {
    create(id);
  } else {
    wins[id].show();
  }
};

module.exports = {
  get,
  create,
  show,
};
