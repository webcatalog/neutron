/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const {
  Notification,
  app,
  dialog,
  ipcMain,
  nativeTheme,
  shell,
  inAppPurchase,
} = require('electron');

const {
  getPreference,
  getPreferences,
  resetPreferences,
  setPreference,
} = require('../libs/preferences');

const {
  getSystemPreference,
  getSystemPreferences,
  setSystemPreference,
} = require('../libs/system-preferences');

const {
  getActiveWorkspace,
  getWorkspace,
  getWorkspacePreference,
  getWorkspacePreferences,
  getWorkspaces,
  setWorkspacePicture,
  removeWorkspacePicture,
  setWorkspaceAccountInfo,
  removeWorkspaceAccountInfo,
} = require('../libs/workspaces');

const {
  getWorkspaceMeta,
  getWorkspaceMetas,
} = require('../libs/workspace-metas');

const {
  clearBrowsingData,
  createWorkspaceView,
  hibernateWorkspaceView,
  loadURL,
  removeWorkspaceView,
  setActiveWorkspaceView,
  setWorkspaceView,
  setWorkspaceViews,
  wakeUpWorkspaceView,
  realignActiveWorkspaceView,
} = require('../libs/workspaces-views');

const {
  reloadView,
  reloadViewDarkReader,
  reloadViewsDarkReader,
  reloadViewsWebContentsIfDidFailLoad,
  setViewsAudioPref,
} = require('../libs/views');

const {
  updatePauseNotificationsInfo,
  getPauseNotificationsInfo,
} = require('../libs/notifications');

const {
  lockApp,
  unlockApp,
  unlockAppUsingTouchId,
} = require('../libs/app-lock');

const { createMenu, showMenu } = require('../libs/menu');
const sendToAllWindows = require('../libs/send-to-all-windows');
const fetchUpdater = require('../libs/fetch-updater');
const getWebsiteIconUrlAsync = require('../libs/get-website-icon-url-async');
const getViewBounds = require('../libs/get-view-bounds');
const isMas = require('../libs/is-mas');

const aboutWindow = require('../windows/about');
const addWorkspaceWindow = require('../windows/add-workspace');
const displayMediaWindow = require('../windows/display-media');
const editWorkspaceWindow = require('../windows/edit-workspace');
const mainWindow = require('../windows/main');
const notificationsWindow = require('../windows/notifications');
const preferencesWindow = require('../windows/preferences');
const workspacePreferencesWindow = require('../windows/workspace-preferences');

const appJson = require('../app.json');

const loadListeners = () => {
  ipcMain.on('request-open-in-browser', (e, url) => {
    shell.openExternal(url);
  });

  ipcMain.on('request-show-message-box', (e, message, type) => {
    dialog.showMessageBox(mainWindow.get(), {
      type: type || 'error',
      message,
      buttons: ['OK'],
      cancelId: 0,
      defaultId: 0,
    }).catch(console.log); // eslint-disable-line
  });

  // Find In Page
  ipcMain.on('request-find-in-page', (e, text, forward) => {
    const contents = mainWindow.get().getBrowserView().webContents;
    contents.findInPage(text, {
      forward,
    });
  });

  ipcMain.on('request-stop-find-in-page', (e, close) => {
    const win = mainWindow.get();
    const view = win.getBrowserView();
    const contents = view.webContents;
    contents.stopFindInPage('clearSelection');

    win.send('update-find-in-page-matches', 0, 0);

    // adjust bounds to hide the gap for find in page
    if (close) {
      const contentSize = win.getContentSize();
      view.setBounds(getViewBounds(contentSize));
    }
  });

  // System Preferences
  ipcMain.on('get-system-preference', (e, name) => {
    const val = getSystemPreference(name);
    e.returnValue = val;
  });

  ipcMain.on('get-system-preferences', (e) => {
    const preferences = getSystemPreferences();
    e.returnValue = preferences;
  });

  ipcMain.on('request-set-system-preference', (e, name, value) => {
    setSystemPreference(name, value);
  });

  // Preferences
  ipcMain.on('get-preference', (e, name) => {
    const val = getPreference(name);
    e.returnValue = val;
  });

  ipcMain.on('get-preferences', (e) => {
    const preferences = getPreferences();
    e.returnValue = preferences;
  });

  ipcMain.on('request-set-preference', (e, name, value) => {
    setPreference(name, value);
  });

  ipcMain.on('request-show-main-window', () => {
    mainWindow.show();
  });

  ipcMain.on('request-show-about-window', () => {
    aboutWindow.show();
  });

  ipcMain.on('request-show-preferences-window', (e, scrollTo) => {
    // prevent opening both global & workspace-specific preferences window
    // to avoid conflicts
    if (workspacePreferencesWindow.get()) {
      workspacePreferencesWindow.get().close();
    }

    preferencesWindow.show(scrollTo);
  });

  ipcMain.on('request-show-workspace-preferences-window', (e, id) => {
    // prevent opening both global & workspace-specific preferences window
    // to avoid conflicts
    if (preferencesWindow.get()) {
      preferencesWindow.get().close();
    }

    workspacePreferencesWindow.show(id);
  });

  ipcMain.on('request-show-edit-workspace-window', (e, id) => {
    editWorkspaceWindow.show(id);
  });

  ipcMain.on('request-show-add-workspace-window', () => {
    addWorkspaceWindow.show();
  });

  ipcMain.on('request-show-notifications-window', () => {
    notificationsWindow.show();
  });

  ipcMain.on('request-reset-preferences', () => {
    resetPreferences();
    createMenu();
  });

  ipcMain.on('request-restart', () => {
    app.relaunch();
    app.exit(0);
  });

  ipcMain.on('request-show-require-reload-workspace-dialog', (e, id) => {
    const win = workspacePreferencesWindow.get() || preferencesWindow.get() || mainWindow.get();
    dialog.showMessageBox(win, {
      type: 'question',
      buttons: ['Reload Now', 'Later'],
      message: 'You need to reload the workspace for this change to take effect.',
      cancelId: 1,
    }).then(({ response }) => {
      if (response === 0) {
        reloadView(id);
      }
    })
    .catch(console.log); // eslint-disable-line
  });

  ipcMain.on('request-show-require-license-dialog', () => {
    const utmSource = isMas() ? `${appJson.id}_app` : 'juli_app';
    const win = workspacePreferencesWindow.get() || preferencesWindow.get();

    if (isMas()) {
      dialog.showMessageBox(win, {
        type: 'info',
        message: `To unlock all features & add unlimited number of workspaces, please purchase ${appJson.name} Plus.`,
        buttons: ['Later', 'Purchase...'],
        cancelId: 0,
        defaultId: 1,
      })
        .then(({ response }) => {
          if (response === 1) {
            const productIdentifier = '';
            inAppPurchase.purchaseProduct(productIdentifier, 1).then((isProductValid) => {
              if (!isProductValid) {
                console.log('The product is not valid.');
                return;
              }

              console.log('The payment has been added to the payment queue.');
            });
          }
        })
        .catch(console.log); // eslint-disable-line no-console
      return;
    }

    dialog.showMessageBox(win, {
      type: 'info',
      message: 'You\'re currently running the free version of WebCatalog. To unlock all features & add unlimited number of workspaces, please purchase WebCatalog Plus (30 USD) from our store and open WebCatalog app to activate it.',
      buttons: ['OK', 'Learn More...'],
      cancelId: 0,
      defaultId: 0,
    })
      .then(({ response }) => {
        if (response === 1) {
          shell.openExternal(`https://webcatalog.app/pricing?utm_source=${utmSource}`);
        }
      })
      .catch(console.log); // eslint-disable-line no-console
  });

  // Notifications
  ipcMain.on('request-show-notification', (e, opts) => {
    if (Notification.isSupported()) {
      const notif = new Notification(opts);
      notif.show();
    }
  });

  ipcMain.on('get-pause-notifications-info', (e) => {
    e.returnValue = getPauseNotificationsInfo();
  });

  ipcMain.on('request-update-pause-notifications-info', () => {
    updatePauseNotificationsInfo();
  });

  // Workspace Metas
  ipcMain.on('get-workspace-meta', (e, id) => {
    e.returnValue = getWorkspaceMeta(id);
  });

  ipcMain.on('get-workspace-metas', (e) => {
    e.returnValue = getWorkspaceMetas();
  });

  // Workspaces
  ipcMain.on('get-workspace', (e, id) => {
    const val = getWorkspace(id);
    e.returnValue = val;
  });

  ipcMain.on('get-workspace-preference', (e, id, preferenceName) => {
    const val = getWorkspacePreference(id, preferenceName);
    e.returnValue = val;
  });

  ipcMain.on('get-workspace-preferences', (e, id) => {
    const val = getWorkspacePreferences(id);
    e.returnValue = val;
  });

  ipcMain.on('get-workspaces', (e) => {
    const workspaces = getWorkspaces();
    e.returnValue = workspaces;
  });

  ipcMain.on('request-create-workspace', (e, workspaceObj = {}) => {
    const { registered } = global.appJson;
    if (!registered) {
      const workspaces = getWorkspaces();

      const maxWorkspaceNum = 2;

      if (Object.keys(workspaces).length >= maxWorkspaceNum) {
        ipcMain.emit('request-show-require-license-dialog');
        return;
      }
    }

    // if name & homeUrl is defined, create custom workspace
    if (workspaceObj.name && workspaceObj.homeUrl) {
      createWorkspaceView(workspaceObj);
    } else { // if not create normal workspace
      createWorkspaceView();
    }
    createMenu();
  });

  ipcMain.on('request-set-active-workspace', (e, id) => {
    if (getWorkspace(id)) {
      setActiveWorkspaceView(id);
      createMenu();
    }
  });

  ipcMain.on('request-realign-active-workspace', () => {
    const {
      sidebar,
      sidebarSize,
      titleBar,
      navigationBar,
    } = getPreferences();

    global.sidebar = sidebar;
    global.sidebarSize = sidebarSize;
    global.titleBar = titleBar;
    global.navigationBar = navigationBar;

    // this function only call browserView.setBounds
    // do not attempt to recall browserView.webContents.focus()
    // as it breaks page focus (cursor, scroll bar not visible)
    realignActiveWorkspaceView();
    createMenu();
  });

  ipcMain.on('request-open-url-in-workspace', (e, url, id) => {
    if (id) {
      // if id is defined, switch to that workspace
      setActiveWorkspaceView(id);
      createMenu();
    } else {
      // if not, create a new workspace
      createWorkspaceView();
      createMenu();
    }

    // load url in the current workspace
    const activeWorkspace = getActiveWorkspace();
    loadURL(url, activeWorkspace.id);
  });

  ipcMain.on('request-wake-up-workspace', (e, id) => {
    wakeUpWorkspaceView(id);
  });

  ipcMain.on('request-hibernate-workspace', (e, id) => {
    hibernateWorkspaceView(id);
  });

  ipcMain.on('request-remove-workspace', (e, id) => {
    // browsing data is shared and kept globally so it won't be deleted
    if (getPreference('shareWorkspaceBrowsingData')) {
      removeWorkspaceView(id);
      createMenu();
      return;
    }

    dialog.showMessageBox(mainWindow.get(), {
      type: 'question',
      buttons: ['Remove Workspace', 'Cancel'],
      message: 'Are you sure? All browsing data of this workspace will be wiped. This action cannot be undone.',
      cancelId: 1,
    })
      .then(({ response }) => {
        if (response === 0) {
          removeWorkspaceView(id);
          createMenu();
        }
      })
      .catch(console.log); // eslint-disable-line
  });

  ipcMain.on('request-set-workspace', (e, id, opts) => {
    setWorkspaceView(id, opts);
    createMenu();
  });

  ipcMain.on('request-set-workspaces', (e, workspaces) => {
    setWorkspaceViews(workspaces);
    createMenu();
  });

  ipcMain.on('request-set-workspace-picture', (e, id, picturePath) => {
    setWorkspacePicture(id, picturePath);
  });

  ipcMain.on('request-set-workspace-account-info', (e, id, accountInfo) => {
    setWorkspaceAccountInfo(id, accountInfo);
  });

  ipcMain.on('request-remove-workspace-picture', (e, id) => {
    removeWorkspacePicture(id);
  });

  ipcMain.on('request-remove-workspace-account-info', (e, id) => {
    removeWorkspaceAccountInfo(id);
  });

  ipcMain.on('request-clear-browsing-data', () => {
    dialog.showMessageBox(preferencesWindow.get() || mainWindow.get(), {
      type: 'question',
      buttons: ['Clear Now', 'Cancel'],
      message: 'Are you sure? All browsing data will be cleared. This action cannot be undone.',
      cancelId: 1,
    }).then(({ response }) => {
      if (response === 0) {
        clearBrowsingData();
      }
    }).catch(console.log); // eslint-disable-line
  });

  ipcMain.on('request-load-url', (e, url, id) => {
    loadURL(url, id);
  });

  ipcMain.on('request-go-home', () => {
    const win = mainWindow.get();

    if (win != null) {
      const activeWorkspace = getActiveWorkspace();
      const contents = win.getBrowserView().webContents;
      contents.loadURL(activeWorkspace.homeUrl || appJson.url);
      win.send('update-can-go-back', contents.canGoBack());
      win.send('update-can-go-forward', contents.canGoForward());
    }
  });

  ipcMain.on('request-go-back', () => {
    const win = mainWindow.get();

    if (win != null) {
      const contents = win.getBrowserView().webContents;
      if (contents.canGoBack()) {
        contents.goBack();
        win.send('update-can-go-back', contents.canGoBack());
        win.send('update-can-go-forward', contents.canGoForward());
      }
    }
  });

  ipcMain.on('request-go-forward', () => {
    const win = mainWindow.get();

    if (win != null) {
      const contents = win.getBrowserView().webContents;
      if (contents.canGoForward()) {
        contents.goForward();
        win.send('update-can-go-back', contents.canGoBack());
        win.send('update-can-go-forward', contents.canGoForward());
      }
    }
  });

  ipcMain.on('request-reload', () => {
    const win = mainWindow.get();

    if (win != null) {
      win.getBrowserView().webContents.reload();
    }
  });

  ipcMain.on('request-check-for-updates', () => {
    fetchUpdater.checkForUpdates();
  });

  ipcMain.on('request-show-display-media-window', (e, workspaceId) => {
    displayMediaWindow.show(workspaceId);
  });

  ipcMain.on('request-quit', () => {
    app.quit();
  });

  // to be replaced with invoke (electron 7+)
  // https://electronjs.org/docs/api/ipc-renderer#ipcrendererinvokechannel-args
  ipcMain.on('request-get-website-icon-url', (e, id, url) => {
    getWebsiteIconUrlAsync(url)
      .then((iconUrl) => {
        sendToAllWindows(id, iconUrl);
      })
      .catch((err) => {
        console.log(err); // eslint-disable-line no-console
        sendToAllWindows(id, null);
      });
  });

  // Native Theme
  ipcMain.on('get-should-use-dark-colors', (e) => {
    e.returnValue = nativeTheme.shouldUseDarkColors;
  });

  ipcMain.on('request-reload-views-dark-reader', () => {
    reloadViewsDarkReader();
  });

  ipcMain.on('request-reload-view-dark-reader', (e, id) => {
    reloadViewDarkReader(id);
  });

  ipcMain.on('request-set-views-audio-prefs', () => {
    setViewsAudioPref();
  });

  // https://www.electronjs.org/docs/tutorial/online-offline-events
  ipcMain.on('online-status-changed', (e, online) => {
    if (online) {
      reloadViewsWebContentsIfDidFailLoad();
    }
  });

  // Register an event listener.
  // When ipcRenderer sends mouse click co-ordinates, show menu at that position.
  // https://dev.to/saisandeepvaddi/creating-a-custom-menu-bar-in-electron-1pi3
  ipcMain.on('request-show-app-menu', (e, x, y) => {
    const win = mainWindow.get();
    if (win) {
      showMenu(win, x, y);
    }
  });

  ipcMain.on('request-lock-app', () => {
    lockApp();
  });

  ipcMain.on('request-unlock-app', (e, password) => {
    unlockApp(password);
  });

  ipcMain.on('request-unlock-app-using-touch-id', () => {
    unlockAppUsingTouchId();
  });

  ipcMain.on('request-enqueue-request-restart-snackbar', () => {
    const win = workspacePreferencesWindow.get() || preferencesWindow.get();
    if (win) {
      win.webContents.send('enqueue-request-restart-snackbar');
    }
  });

  ipcMain.on('create-menu', () => {
    createMenu();
  });
};

module.exports = loadListeners;
