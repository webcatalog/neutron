const { BrowserWindow } = require('electron');
const path = require('path');

const { REACT_PATH } = require('../constants/paths');

let win;
let activeType = null;

const get = () => win;

const create = (type) => {
  activeType = type;

  global.codeInjectionType = type;

  win = new BrowserWindow({
    backgroundColor: '#FFF',
    width: 640,
    height: 560,
    resizable: false,
    maximizable: false,
    minimizable: false,
    fullscreenable: false,
    autoHideMenuBar: false,
    show: false,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      preload: path.join(__dirname, '..', 'preload', 'code-injection.js'),
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

const show = (id) => {
  if (win == null) {
    create(id);
  } else if (id !== activeType) {
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
