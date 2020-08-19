const { BrowserWindow, BrowserView, ipcMain } = require('electron');
const path = require('path');

const { REACT_PATH } = require('../constants/paths');

let win;

const get = () => win;

const create = (viewId) => {
  global.displayMediaRequestedViewId = viewId;

  win = new BrowserWindow({
    backgroundColor: '#FFF',
    width: 400,
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
      preload: path.join(__dirname, '..', 'preload', 'display-media.js'),
    },
  });
  win.setMenuBarVisibility(false);

  const onClose = () => {
    BrowserView.fromId(global.displayMediaRequestedViewId).webContents.send('display-media-id-received', null);
  };
  win.on('close', onClose);

  const onSelected = (e, displayMediaId) => {
    BrowserView.fromId(global.displayMediaRequestedViewId).webContents.send('display-media-id-received', displayMediaId);
    ipcMain.removeListener('display-media-selected', onSelected);
    if (win) {
      win.removeListener('close', onClose);
      win.close();
    }
  };
  ipcMain.once('display-media-selected', onSelected);

  win.on('closed', () => {
    win = null;
  });

  win.once('ready-to-show', () => {
    win.show();
  });

  win.loadURL(REACT_PATH);
};

const show = (viewId) => {
  if (win == null) {
    create(viewId);
  } else if (viewId !== global.displayMediaRequestedViewId) {
    win.close();
    create(viewId);
  } else {
    win.show();
  }
};

module.exports = {
  get,
  create,
  show,
};
