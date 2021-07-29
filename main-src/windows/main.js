/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
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
const contextMenu = require('electron-context-menu');

const { REACT_PATH } = require('../constants/paths');
const { setPreference, getPreference } = require('../libs/preferences');
const isKdeAsync = require('../libs/is-kde-async');
const isMas = require('../libs/is-mas');
const appJson = require('../constants/app-json');
const isSnap = require('../libs/is-snap');
const isWebcatalog = require('../libs/is-webcatalog');
const isAppx = require('../libs/is-appx');

let win;
let mb = {};
let tray;
let cachedBrowserViewTitle = '';

const get = () => {
  if (global.attachToMenubar) return mb.window;
  return win;
};

const enableSwipeToNavigate = (_win) => {
  _win.on('swipe', (e, direction) => {
    const view = _win.getBrowserView();
    if (view) {
      if (direction === 'left') {
        view.webContents.goBack();
      } else if (direction === 'right') {
        view.webContents.goForward();
      }
    }
  });
};

const createAsync = () => new Promise((resolve) => {
  const refreshTitle = (browserWindow, _browserViewTitle) => {
    let browserViewTitle = cachedBrowserViewTitle;
    if (typeof _browserViewTitle === 'string') {
      browserViewTitle = _browserViewTitle;
      cachedBrowserViewTitle = _browserViewTitle;
    }

    let { badgeCount } = global;
    if (typeof badgeCount !== 'number' || Number.isNaN(badgeCount)) {
      badgeCount = 0;
    }

    let prefixTitle = app.name;
    if (badgeCount > 0) {
      prefixTitle = `${app.name} (${badgeCount})`;
    }

    if (browserViewTitle !== '') {
      browserWindow.setTitle(`${prefixTitle} - ${browserViewTitle}`);
    } else {
      browserWindow.setTitle(prefixTitle);
    }
  };

  const handleTrayRightClick = () => {
    const muteApp = getPreference('muteApp');
    const lockMenuItems = Boolean(global.appLock) && !global.locked ? [
      {
        type: 'separator',
      },
      {
        label: 'Lock',
        click: () => ipcMain.emit('request-lock-app'),
      },
    ] : [];

    const trayContextMenu = Menu.buildFromTemplate([
      {
        label: `Open ${appJson.name}`,
        click: () => {
          if (global.attachToMenubar) {
            mb.showWindow();
            return;
          }

          if (win == null) {
            createAsync();
          } else {
            win.show();
          }
        },
      },
      {
        type: 'separator',
      },
      {
        label: `About ${appJson.name}`,
        click: () => ipcMain.emit('request-show-preferences-window', null, 'about'),
      },
      ...lockMenuItems,
      {
        type: 'separator',
        visible: !isMas() && !isSnap() && !isAppx(),
      },
      {
        label: 'Check for Updates...',
        click: () => ipcMain.emit('request-check-for-updates'),
        visible: !isMas() && !isSnap() && !isAppx(),
      },
      {
        type: 'separator',
      },
      {
        label: 'Notifications...',
        click: () => ipcMain.emit('request-show-notifications-window'),
        enabled: !global.locked,
      },
      { type: 'separator' },
      {
        label: muteApp ? 'Unmute' : 'Mute',
        click: () => setPreference('muteApp', !muteApp),
        enabled: !global.locked,
      },
      { type: 'separator' },
      {
        label: 'Preferences...',
        click: () => ipcMain.emit('request-show-preferences-window'),
      },
      { type: 'separator' },
      {
        label: 'Quit',
        click: () => {
          if (global.attachToMenubar) {
            mb.app.quit();
            return;
          }
          app.quit();
        },
      },
    ]);

    (global.attachToMenubar ? mb.tray : tray).popUpContextMenu(trayContextMenu);
  };

  const handleAppCommand = (e, cmd) => {
    // https://docs.microsoft.com/en-us/windows/win32/inputdev/wm-appcommand?redirectedfrom=MSDN
    // Handle mouse events on Linux & Windows
    switch (cmd) {
      case 'browser-backward':
        ipcMain.emit('request-go-back');
        break;
      case 'browser-forward':
        ipcMain.emit('request-go-forward');
        break;
      case 'browser-refresh':
        ipcMain.emit('request-reload');
        break;
      case 'browser-home':
        ipcMain.emit('request-go-home');
        break;
      default: break;
    }
  };

  if (global.attachToMenubar) {
    const menubarWindowState = windowStateKeeper({
      file: 'window-state-menubar.json',
      defaultWidth: 400,
      defaultHeight: 400,
    });

    // setImage after Tray instance is created to avoid
    // "Segmentation fault (core dumped)" bug on Linux
    // https://github.com/electron/electron/issues/22137#issuecomment-586105622
    // https://github.com/atomery/translatium/issues/164
    const menubarTray = new Tray(nativeImage.createEmpty());
    // icon template on macOS is only available for Singlebox, not apps generated by WebCatalog
    // icon template is not supported on Windows & Linux
    const iconFileName = process.platform === 'darwin' && !isWebcatalog() ? 'menubarTemplate.png' : 'menubar-icon.png';
    const iconPath = process.env.NODE_ENV === 'production'
      ? path.resolve(__dirname, iconFileName)
      : path.resolve(__dirname, '..', '..', 'public', iconFileName);
    menubarTray.setImage(iconPath);

    const alwaysOnTop = getPreference('alwaysOnTop');
    mb = menubar({
      index: REACT_PATH,
      tray: menubarTray,
      preloadWindow: true,
      tooltip: appJson.name,
      browserWindow: {
        alwaysOnTop,
        x: menubarWindowState.x,
        y: menubarWindowState.y,
        width: menubarWindowState.width,
        height: menubarWindowState.height,
        minHeight: 100,
        minWidth: 400,
        // show traffic light buttons on macOS if alwaysOnTop is enabled
        // so users have mean to close the window
        titleBarStyle: alwaysOnTop ? 'hidden' : undefined,
        fullscreenable: false,
        webPreferences: {
          enableRemoteModule: true,
          contextIsolation: false,
          nodeIntegration: true,
          webSecurity: process.env.NODE_ENV === 'production',
          preload: path.join(__dirname, 'menubar-preload.js'),
        },
      },
    });

    mb.on('after-create-window', () => {
      mb.window.refreshTitle = (...args) => {
        refreshTitle(mb.window, ...args);
      };

      menubarWindowState.manage(mb.window);
      contextMenu({ window: mb.window });

      mb.window.on('show', () => {
        ipcMain.emit('request-realign-active-workspace');
      });

      mb.window.on('focus', () => {
        const view = mb.window.getBrowserView();
        if (view && view.webContents) {
          view.webContents.focus();
        }
      });

      mb.window.on('app-command', handleAppCommand);

      // Enable swipe to navigate
      const swipeToNavigate = getPreference('swipeToNavigate');
      if (swipeToNavigate) {
        enableSwipeToNavigate(mb.window);
      }
    });

    mb.on('ready', () => {
      mb.tray.on('right-click', handleTrayRightClick);

      resolve();
    });
    return;
  }

  // check system-preferences.js
  // wasOpenedAsHidden is only available on macOS
  const { wasOpenedAsHidden } = app.getLoginItemSettings();

  const mainWindowState = windowStateKeeper({
    defaultWidth: 1024,
    defaultHeight: 768,
  });

  const winOpts = {
    backgroundColor: '#FFF',
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minHeight: 100,
    minWidth: 400,
    title: global.appJson.name,
    // show traffic light buttons on macOS if global.windowButtons = true
    titleBarStyle: global.windowButtons ? 'hidden' : 'default',
    frame: (process.platform === 'darwin' && global.windowButtons) || global.useSystemTitleBar,
    show: false,
    alwaysOnTop: getPreference('alwaysOnTop'),
    autoHideMenuBar: global.useSystemTitleBar && getPreference('autoHideMenuBar'),
    webPreferences: {
      enableRemoteModule: true,
      contextIsolation: false,
      nodeIntegration: true,
      webSecurity: process.env.NODE_ENV === 'production',
      preload: path.join(__dirname, 'main-preload.js'),
    },
  };
  // winOpts.icon cannot be set to undefined
  // as it'd crash Electron on macOS
  // https://github.com/electron/electron/issues/27303#issuecomment-759501184
  if (process.platform === 'linux') {
    winOpts.icon = process.env.NODE_ENV === 'production'
      ? path.resolve(__dirname, 'dock-icon.png')
      : path.resolve(__dirname, '..', '..', 'public', 'dock-icon.png');
  }
  win = new BrowserWindow(winOpts);

  win.refreshTitle = (...args) => {
    refreshTitle(win, ...args);
  };

  contextMenu({ window: win });

  mainWindowState.manage(win);

  // Enable swipe to navigate
  const swipeToNavigate = getPreference('swipeToNavigate');
  if (swipeToNavigate) {
    enableSwipeToNavigate(win);
  }

  // Hide window instead closing on macos
  win.on('close', (e) => {
    if ((process.platform === 'darwin' || global.runInBackground === true) && win && !win.forceClose) {
      e.preventDefault();
      // on Mac, app won't quit, so lock the app when window is closed but app stays in dock
      ipcMain.emit('request-lock-app');
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

  win.on('maximize', () => {
    win.webContents.send('set-is-maximized', true);
  });
  win.on('unmaximize', () => {
    win.webContents.send('set-is-maximized', false);
  });

  // If BrowserWindows has BrowserView attached
  // KDE Plasma desktop environment will refuse to minimize the app window
  // so we detach the BrowserView when minimizing and restore it later
  // https://github.com/webcatalog/webcatalog-app/issues/1201
  // only apply this bug fix in KDE Plasma environment
  // as it makes the app feels sluggish (it takes time to restore BrowserView)
  // also for unknown reason, win.on('restore') is not
  //  triggered on Windows (production-only, somehow it's working in dev)
  isKdeAsync()
    .then((isKde) => {
      if (!isKde) return;
      win.on('minimize', () => {
        win.setBrowserView(null);
      });
    });

  win.on('restore', () => {
    // we need this because:
    // In KDE, we call setBrowserView(null) when the app is minimized so we need restore it
    // also, this is to an attemp fix a bug on Windows which causes BrowserView not to show up
    // after the window is minimizing for some time
    // https://github.com/webcatalog/webcatalog-app/issues/1359
    ipcMain.emit('request-realign-active-workspace');
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
    // it takes some time for the fullscreen state to populate
    setTimeout(() => {
      ipcMain.emit('request-realign-active-workspace');
    }, 500);
  });
  win.on('leave-full-screen', () => {
    win.webContents.send('is-fullscreen-updated', false);
    // it takes some time for the fullscreen state to populate
    setTimeout(() => {
      ipcMain.emit('request-realign-active-workspace');
    }, 500);
  });

  win.on('app-command', handleAppCommand);

  // ensure redux is loaded first
  // if not, redux might not be able catch changes sent from ipcMain
  win.webContents.once('did-stop-loading', () => {
    resolve();
  });

  win.loadURL(REACT_PATH);

  const shouldShowTray = global.trayIcon || (process.platform !== 'darwin' && global.runInBackground);
  if (shouldShowTray && tray == null) {
    tray = new Tray(nativeImage.createEmpty());
    // icon template on macOS is only available for Singlebox, not apps generated by WebCatalog
    // icon template is not supported on Windows & Linux
    const iconFileName = process.platform === 'darwin' && !isWebcatalog() ? 'menubarTemplate.png' : 'menubar-icon.png';
    const iconPath = process.env.NODE_ENV === 'production'
      ? path.resolve(__dirname, iconFileName)
      : path.resolve(__dirname, '..', '..', 'public', iconFileName);
    tray.setImage(iconPath);
    tray.on('click', () => {
      if (win == null) {
        createAsync();
      } else {
        win.show();
      }
    });
    tray.setToolTip(app.name);
    tray.on('right-click', handleTrayRightClick);
  }
});

const show = () => {
  if (global.attachToMenubar) {
    if (mb == null) {
      createAsync();
    } else {
      mb.showWindow();
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
