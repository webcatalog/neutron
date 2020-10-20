const {
  BrowserWindow,
  Menu,
  Tray,
  app,
  ipcMain,
  nativeImage,
} = require('electron');
const windowStateKeeper = require('electron-window-state');
const { menubar } = require('menubar');
const path = require('path');
const isDev = require('electron-is-dev');

const { REACT_PATH } = require('../constants/paths');
const { getPreference } = require('../libs/preferences');
const formatBytes = require('../libs/format-bytes');
const appJson = require('../app.json');

let win;
let mb = {};
let attachToMenubar = false;

const get = () => {
  if (attachToMenubar) return mb.window;
  return win;
};

const createAsync = () => new Promise((resolve) => {
  attachToMenubar = getPreference('attachToMenubar');
  if (attachToMenubar) {
    const menubarWindowState = windowStateKeeper({
      file: 'window-state-menubar.json',
      defaultWidth: 400,
      defaultHeight: 400,
    });

    // setImage after Tray instance is created to avoid
    // "Segmentation fault (core dumped)" bug on Linux
    // https://github.com/electron/electron/issues/22137#issuecomment-586105622
    // https://github.com/atomery/translatium/issues/164
    const tray = new Tray(nativeImage.createEmpty());
    // icon template on macOS is only available for Singlebox, not apps generated by WebCatalog
    // icon template is not supported on Windows & Linux
    const iconPath = path.resolve(
      __dirname,
      '..',
      'menubar-icon.png',
    );
    tray.setImage(iconPath);

    mb = menubar({
      index: REACT_PATH,
      tray,
      preloadWindow: true,
      tooltip: appJson.name,
      browserWindow: {
        x: menubarWindowState.x,
        y: menubarWindowState.y,
        width: menubarWindowState.width,
        height: menubarWindowState.height,
        minHeight: 100,
        minWidth: 250,
        webPreferences: {
          enableRemoteModule: true,
          nodeIntegration: true,
          webSecurity: !isDev,
          preload: path.join(__dirname, '..', 'preload', 'menubar.js'),
        },
      },
    });

    mb.on('after-create-window', () => {
      menubarWindowState.manage(mb.window);

      mb.window.on('focus', () => {
        const view = mb.window.getBrowserView();
        if (view && view.webContents) {
          view.webContents.focus();
        }
      });
    });

    mb.on('ready', () => {
      mb.tray.on('right-click', () => {
        const updaterEnabled = process.env.SNAP == null
          && !process.mas && !process.windowsStore;

        const updaterMenuItem = {
          label: 'Check for Updates...',
          click: () => ipcMain.emit('request-check-for-updates'),
          visible: updaterEnabled,
        };
        if (global.updaterObj && global.updaterObj.status === 'update-downloaded') {
          updaterMenuItem.label = 'Restart to Apply Updates...';
        } else if (global.updaterObj && global.updaterObj.status === 'update-available') {
          updaterMenuItem.label = 'Downloading Updates...';
          updaterMenuItem.enabled = false;
        } else if (global.updaterObj && global.updaterObj.status === 'download-progress') {
          const { transferred, total, bytesPerSecond } = global.updaterObj.info;
          updaterMenuItem.label = `Downloading Updates (${formatBytes(transferred)}/${formatBytes(total)} at ${formatBytes(bytesPerSecond)}/s)...`;
          updaterMenuItem.enabled = false;
        } else if (global.updaterObj && global.updaterObj.status === 'checking-for-update') {
          updaterMenuItem.label = 'Checking for Updates...';
          updaterMenuItem.enabled = false;
        }

        const contextMenu = Menu.buildFromTemplate([
          {
            label: `Open ${appJson.name}`,
            click: () => mb.showWindow(),
          },
          {
            type: 'separator',
          },
          {
            label: `About ${appJson.name}`,
            click: () => ipcMain.emit('request-show-about-window'),
          },
          { type: 'separator' },
          updaterMenuItem,
          {
            type: 'separator',
            visible: updaterEnabled,
          },
          {
            label: 'Preferences...',
            click: () => ipcMain.emit('request-show-preferences-window'),
          },
          { type: 'separator' },
          {
            label: 'Quit',
            click: () => {
              mb.app.quit();
            },
          },
        ]);

        mb.tray.popUpContextMenu(contextMenu);
      });

      resolve();
    });
    return;
  }

  const { wasOpenedAsHidden } = app.getLoginItemSettings();

  const mainWindowState = windowStateKeeper({
    defaultWidth: 800,
    defaultHeight: 768,
  });

  win = new BrowserWindow({
    backgroundColor: '#FFF',
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minHeight: 100,
    minWidth: 350,
    title: global.appJson.name,
    titleBarStyle: 'hidden',
    show: false,
    frame: process.platform === 'darwin',
    icon: process.platform === 'linux' ? path.resolve(__dirname, '..', 'dock-icon.png') : undefined,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      webSecurity: !isDev,
      preload: path.join(__dirname, '..', 'preload', 'main.js'),
    },
  });
  if (getPreference('hideMenuBar')) {
    win.setMenuBarVisibility(false);
  }

  mainWindowState.manage(win);

  // Enable swipe to navigate
  const swipeToNavigate = getPreference('swipeToNavigate');
  if (swipeToNavigate) {
    win.on('swipe', (e, direction) => {
      const view = win.getBrowserView();
      if (view) {
        if (direction === 'left') {
          view.webContents.goBack();
        } else if (direction === 'right') {
          view.webContents.goForward();
        }
      }
    });
  }

  // Hide window instead closing on macos
  win.on('close', (e) => {
    if (process.platform === 'darwin' && win && !win.forceClose) {
      e.preventDefault();
      // https://github.com/electron/electron/issues/6033#issuecomment-242023295
      if (win.isFullScreen()) {
        win.once('leave-full-screen', () => {
          win.hide();
        });
        win.setFullScreen(false);
      } else {
        win.hide();
      }
    }
  });

  win.on('closed', () => {
    win = null;
  });

  win.on('focus', () => {
    const view = win.getBrowserView();
    if (view && view.webContents) {
      view.webContents.focus();
    }
  });

  win.once('ready-to-show', () => {
    if (!wasOpenedAsHidden) {
      win.show();
    }

    // calling this to redundantly setBounds BrowserView
    // after the UI is fully loaded
    // if not, BrowserView mouseover event won't work correctly
    // https://github.com/webcatalog/webcatalog-app/issues/812
    ipcMain.emit('request-realign-active-workspace');
  });

  win.on('enter-full-screen', () => {
    win.webContents.send('is-fullscreen-updated', true);
    ipcMain.emit('request-realign-active-workspace');
  });
  win.on('leave-full-screen', () => {
    win.webContents.send('is-fullscreen-updated', false);
    ipcMain.emit('request-realign-active-workspace');
  });

  // ensure redux is loaded first
  // if not, redux might not be able catch changes sent from ipcMain
  win.webContents.once('did-stop-loading', () => {
    resolve();
  });

  win.loadURL(REACT_PATH);
});

const show = () => {
  if (attachToMenubar) {
    if (mb == null) {
      createAsync();
    } else {
      mb.on('ready', () => {
        mb.showWindow();
      });
    }
  } else if (win == null) {
    createAsync();
  } else {
    win.show();
  }
};

const send = (...args) => {
  if (get() !== null) {
    get().webContents.send(...args);
  }
};

module.exports = {
  createAsync,
  get,
  send,
  show,
};
