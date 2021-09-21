/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const {
  BrowserWindow,
  Notification,
  ShareMenu,
  app,
  dialog,
  inAppPurchase,
  ipcMain,
  nativeTheme,
  shell,
  BrowserView,
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
  removeWorkspacePicture,
  setWorkspaceAccountInfo,
  removeWorkspaceAccountInfo,
  setWorkspace,
} = require('../libs/workspaces');
const {
  getWorkspaceMeta,
  getWorkspaceMetas,
} = require('../libs/workspace-metas');

const {
  refreshBadgeCount,
} = require('../libs/workspace-badges');

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
  setBrowserView,
  constructBrowserViewKey,
  getBrowserViews,
  getBrowserView,
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
const isStandalone = require('../libs/is-standalone');
const isSnap = require('../libs/is-snap');
const getIapFormattedPriceAsync = require('../libs/get-iap-formatted-price-async');
const getUtmSource = require('../libs/get-utm-source');
const getWorkspaceFriendlyName = require('../libs/get-workspace-friendly-name');
const trackAddWorkspaceAsync = require('../libs/track-add-workspace-async');

const addWorkspaceWindow = require('../windows/add-workspace');
const displayMediaWindow = require('../windows/display-media');
const licenseRegistrationWindow = require('../windows/license-registration');
const mainWindow = require('../windows/main');
const notificationsWindow = require('../windows/notifications');
const openSourceNoticesWindow = require('../windows/open-source-notices');
const preferencesWindow = require('../windows/preferences');
const workspacePreferencesWindow = require('../windows/workspace-preferences');

const appJson = require('../constants/app-json');

const loadListeners = () => {
  ipcMain.on('request-open-in-browser', (e, url) => {
    shell.openExternal(url);
  });

  ipcMain.on('request-show-message-box', (e, message, type) => {
    const senderWindow = e && e.sender ? BrowserWindow.fromWebContents(e.sender) : undefined;
    dialog.showMessageBox(senderWindow || mainWindow.get(), {
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

  ipcMain.on('request-show-open-source-notices-window', () => {
    openSourceNoticesWindow.show();
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

  ipcMain.on('request-restart', (e) => {
    // app.relaunch() is not supported in MAS build
    // calling it would crash th app
    if (isMas()) {
      const senderWindow = e && e.sender ? BrowserWindow.fromWebContents(e.sender) : undefined;
      dialog.showMessageBox(senderWindow, {
        type: 'question',
        buttons: ['Quit Now', 'Later'],
        message: 'You need to quit and then manually restart the app for the changes to take effect.',
        cancelId: 1,
      })
        .then(({ response }) => {
          if (response === 0) {
            app.quit();
          }
        })
        .catch(console.log); // eslint-disable-line no-console
      return;
    }

    app.relaunch();
    app.exit(0);
  });

  ipcMain.on('request-show-require-reload-workspace-dialog', (e, id) => {
    const senderWindow = e && e.sender ? BrowserWindow.fromWebContents(e.sender) : undefined;
    const win = senderWindow
      || workspacePreferencesWindow.get() || preferencesWindow.get() || mainWindow.get();
    dialog.showMessageBox(win, {
      type: 'question',
      buttons: ['Reload Now', 'Later'],
      message: `You need to reload the ${getWorkspaceFriendlyName().toLowerCase()} for this change to take effect.`,
      cancelId: 1,
    }).then(({ response }) => {
      if (response === 0) {
        reloadView(id);
      }
    })
    .catch(console.log); // eslint-disable-line
  });

  ipcMain.on('request-show-require-license-dialog', (e) => {
    const utmSource = getUtmSource();
    const senderWindow = e && e.sender ? BrowserWindow.fromWebContents(e.sender) : undefined;
    const win = senderWindow
      || workspacePreferencesWindow.get() || preferencesWindow.get();

    if (isStandalone()) {
      licenseRegistrationWindow.show();
      return;
    }

    if (isMas()) {
      // get price
      getIapFormattedPriceAsync(appJson.iapProductIdentifier)
        .then((formattedPrice) => {
          dialog.showMessageBox(win, {
            type: 'info',
            message: `Upgrade to ${appJson.name} Plus (${formattedPrice ? `${formattedPrice}, ` : ''}one-time payment for lifetime use) to unlock all features & add unlimited number of ${getWorkspaceFriendlyName(true).toLowerCase()}.`,
            buttons: [`Purchase${formattedPrice ? ` (${formattedPrice})` : ''}...`, 'Restore Purchase', 'Later'],
            cancelId: 2,
            defaultId: 0,
          })
            .then(({ response }) => {
              if (response === 0) {
                inAppPurchase.purchaseProduct(
                  appJson.iapProductIdentifier,
                ).then((isProductValid) => {
                  if (!isProductValid) {
                    // eslint-disable-next-line no-console
                    console.log('The product is not valid.');
                    return;
                  }

                  // eslint-disable-next-line no-console
                  console.log('The payment has been added to the payment queue.');
                });
              }

              if (response === 1) {
                inAppPurchase.restoreCompletedTransactions();
              }
            })
            .catch(console.log); // eslint-disable-line no-console
        });
      return;
    }

    dialog.showMessageBox(win, {
      type: 'info',
      message: `You're currently running the free version of WebCatalog. To unlock all features & add unlimited number of ${getWorkspaceFriendlyName(true).toLowerCase()}, please purchase WebCatalog Lifetime from our website and open WebCatalog app to activate it.`,
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
    const iapPurchased = isMas() ? getPreference('iapPurchased') : false;
    const standaloneRegistered = isStandalone() ? getPreference('standaloneRegistered') : false;
    if (!registered && !iapPurchased && !standaloneRegistered) {
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

  ipcMain.on('request-hibernate-workspace', (e, id, timeout) => {
    hibernateWorkspaceView(id, timeout);
  });

  ipcMain.on('request-remove-workspace', (e, id) => {
    // browsing data is shared and kept globally so it won't be deleted
    if (getPreference('shareWorkspaceBrowsingData')) {
      removeWorkspaceView(id);
      createMenu();
      return;
    }

    const senderWindow = e && e.sender ? BrowserWindow.fromWebContents(e.sender) : undefined;
    dialog.showMessageBox(senderWindow || mainWindow.get(), {
      type: 'question',
      buttons: [`Remove ${getWorkspaceFriendlyName()}`, 'Cancel'],
      message: `Are you sure? All browsing data of this ${getWorkspaceFriendlyName().toLowerCase()} will be wiped. This action cannot be undone.`,
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

  ipcMain.on('request-set-workspace-account-info', (e, id, accountInfo) => {
    setWorkspaceAccountInfo(id, accountInfo);
  });

  ipcMain.on('request-remove-workspace-picture', (e, id) => {
    removeWorkspacePicture(id);
  });

  ipcMain.on('request-remove-workspace-account-info', (e, id) => {
    removeWorkspaceAccountInfo(id);
  });

  ipcMain.on('request-clear-browsing-data', (e) => {
    const senderWindow = e && e.sender ? BrowserWindow.fromWebContents(e.sender) : undefined;
    dialog.showMessageBox(senderWindow || mainWindow.get(), {
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

  ipcMain.on('request-load-url', (e, url, id, openInNewWindow) => {
    loadURL(url, id, openInNewWindow);
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

  ipcMain.on('request-check-for-updates', (e, isSilent) => {
    if (isStandalone() && !isSnap()) {
      // eslint-disable-next-line global-require
      const { autoUpdater } = require('electron-updater');
      // https://github.com/electron-userland/electron-builder/issues/4028
      if (!autoUpdater.isUpdaterActive()) return;

      // restart & apply updates
      if (global.updaterObj && global.updaterObj.status === 'update-downloaded') {
        setImmediate(() => {
          app.removeAllListeners('window-all-closed');
          const wins = BrowserWindow.getAllWindows();
          wins.forEach((win) => {
            // https://github.com/electron-userland/electron-builder/issues/1604#issuecomment-372091881
            win.removeAllListeners('close');
            win.close();
          });
          autoUpdater.quitAndInstall(false);
        });
      }

      // check for updates
      global.updateSilent = Boolean(isSilent);
      autoUpdater.checkForUpdates();
      return;
    }

    fetchUpdater.checkForUpdates();
  });

  ipcMain.on('request-show-display-media-window', (e) => {
    displayMediaWindow.show(e.sender);
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

  ipcMain.on('request-show-share-menu', () => {
    const win = mainWindow.get();
    if (win) {
      const view = win.getBrowserView();
      if (view && view.webContents) {
        const url = view.webContents.getURL();
        if (url) {
          const shareMenu = new ShareMenu({
            urls: [url],
          });
          shareMenu.popup(win);
        }
      }
    }
  });

  ipcMain.on('request-refresh-badge-count', () => {
    const win = mainWindow.get();
    if (win) {
      refreshBadgeCount(win);
    }
  });

  ipcMain.on('is-popup', (e) => {
    // webContents.isPopup is set and used internally by Neutron
    e.returnValue = Boolean(e.sender.isPopup);
  });

  ipcMain.on('request-track-add-workspace', (_, deviceId, appId) => {
    trackAddWorkspaceAsync(deviceId, appId);
  });

  ipcMain.on('request-new-tab-browser', (_, tabInfo) => {
    const win = mainWindow.get();
    const browserView = win.getBrowserView();

    const { tabIndex, homeUrl } = tabInfo;
    // Workspace ID
    const { id, tabs } = getActiveWorkspace();
    const lastUrl = browserView.webContents.getURL();

    // Update workspace config
    setWorkspace(id, {
      tabs: {
        ...tabs,
        [tabIndex]: { homeUrl, lastUrl },
      },
    });
  });

  ipcMain.on('request-open-tab-browser', (_, tabInfo) => {
    const { newTabIndex, selectedTabIndex } = tabInfo;
    const currentWorkspace = getActiveWorkspace();
    const win = mainWindow.get();
    const currentBrowserView = win.getBrowserView();

    // Latest Url from tab session.
    const { id, lastUrl, tabs } = currentWorkspace;

    // Construct keys for new browserView to be added and browserView to update.
    const currentBrowserViewKey = constructBrowserViewKey(id, selectedTabIndex);
    const newBrowserViewKey = constructBrowserViewKey(id, newTabIndex);

    // Get new browserView from current dataset.
    const newBrowserView = getBrowserView(newBrowserViewKey);

    // Preserve current browserView.
    setBrowserView(currentBrowserViewKey, currentBrowserView);

    // Update workspace config
    setWorkspace(id, {
      tabs: {
        ...tabs,
        tabIndex: {
          ...tabs[newTabIndex],
          lastUrl,
        },
      },
    });

    // Clear current browserView to prevent memory leaks.
    win.setBrowserView(undefined);

    if (newBrowserView) {
      win.setBrowserView(newBrowserView);
    } else {
      const browserView = new BrowserView();
      win.setBrowserView(browserView);

      const contentSize = win.getContentSize();
      const {
        x,
        y,
        width,
        height,
      } = getViewBounds(contentSize);

      browserView.setBounds({
        x,
        y: y + 48,
        width,
        height,
      });
      browserView.setBackgroundColor('#FFF');
      browserView.webContents.loadURL(lastUrl);
    }
  });

  ipcMain.on('request-close-tab-browser', (_, tabInfo) => {
    const { tabIndex } = tabInfo;
    const { id, tabs } = getActiveWorkspace();

    const win = mainWindow.get();
    const browserView = win.getBrowserView();
    const webContents = browserView.webContents;

    delete tabs[tabIndex];
    webContents.forcefullyCrashRenderer();

    setWorkspace(id, { tabs });
  });
};

module.exports = loadListeners;
