/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
require('source-map-support').install();

// for navigator.geolocation API
// disable this in production Mac App Store build
// (App Store Review keeps rejecting the app for requesting location permission)
if (!process.mas) {
  process.env.GOOGLE_API_KEY = process.env.ELECTRON_APP_GOOGLE_API_KEY;
}

const {
  app,
  dialog,
  ipcMain,
  nativeTheme,
  protocol,
  BrowserWindow,
  inAppPurchase,
  shell,
} = require('electron');
const path = require('path');
const fs = require('fs-extra');
const isDev = require('electron-is-dev');
const settings = require('electron-settings');

const appJson = require('./constants/app-json');
const isMas = require('./libs/is-mas');

// run before anything else
// WebCatalog Engine 13.x and lower uses default Electron user data path
// so we don't apply this if legacyUserData = true
// to keep the app backward compatible
const useLegacyUserDataPath = appJson.opts && appJson.opts.legacyUserData;
if (!useLegacyUserDataPath) {
  const slug = appJson.opts && appJson.opts.slug;
  // append name slug to user data dir name (if available)
  // to make it easier for pro users to identify
  // as custom app id (custom-xxx) is computer-generated & not easy to look at
  const userDataPath = path.join(app.getPath('appData'), 'WebCatalog', 'webcatalog-engine-data', slug ? `${appJson.id}-${slug}` : appJson.id);
  fs.ensureDirSync(userDataPath);
  app.setPath('userData', userDataPath);
} else if (isMas() && appJson.id === 'singlebox-plus') {
  // Singlebox (paid MAS) is renamed to "Singlebox Plus"
  // we set userDataPath to legacy Singlebox path (if already exists) for backward compatibility
  const legacyUserDataPath = path.join(app.getPath('appData'), 'Singlebox');
  app.setPath('userData', legacyUserDataPath);
  // PanText is renamed to Singlebox
} else if (appJson.id === 'singlebox') {
  const legacyUserDataPath = path.join(app.getPath('appData'), 'PanText');
  if (fs.existsSync(legacyUserDataPath)) {
    app.setPath('userData', legacyUserDataPath);
  }
}

settings.configure({
  fileName: 'Settings', // backward compatible with electron-settings@3
});

const {
  getPreference,
  getPreferences,
  setPreference,
} = require('./libs/preferences');

// Activate the Sentry Electron SDK as early as possible in every process.
if (!isDev && getPreference('sentry')) {
  // eslint-disable-next-line global-require
  require('./libs/sentry');
}

const loadListeners = require('./listeners');
const loadInvokers = require('./invokers');

const authWindow = require('./windows/auth');
const mainWindow = require('./windows/main');
const openUrlWithWindow = require('./windows/open-url-with');

const { createMenu } = require('./libs/menu');
const {
  addViewAsync,
  reloadViewsDarkReader,
} = require('./libs/views');
const fetchUpdater = require('./libs/fetch-updater');
const { getWorkspaces, setWorkspace } = require('./libs/workspaces');
const sendToAllWindows = require('./libs/send-to-all-windows');
const extractHostname = require('./libs/extract-hostname');
const { getAppLockStatusAsync, unlockAppUsingTouchId } = require('./libs/app-lock');
const isMacOs11 = require('./libs/is-mac-os-11');
const isWindows10 = require('./libs/is-windows-10');
const getIapFormattedPriceAsync = require('./libs/get-iap-formatted-price-async');
const promptSetAsDefaultMailClient = require('./libs/prompt-set-as-default-email-client');
const promptSetAsDefaultCalendarApp = require('./libs/prompt-set-as-default-calendar-app');
const getWorkspaceFriendlyName = require('./libs/get-workspace-friendly-name');

const MAILTO_URLS = require('./constants/mailto-urls');
const WEBCAL_URLS = require('./constants/webcal-urls');
const isStandalone = require('./libs/is-standalone');
const isSnap = require('./libs/is-snap');

if (isStandalone() && !isSnap()) {
  // eslint-disable-next-line global-require
  require('./libs/electron-updater');
}

const gotTheLock = isMas() || app.requestSingleInstanceLock();

if (!gotTheLock) {
  // eslint-disable-next-line
  app.quit();
} else {
  app.setName(appJson.name);

  const useHardwareAcceleration = getPreference('useHardwareAcceleration');
  if (!useHardwareAcceleration) {
    app.disableHardwareAcceleration();
  }

  const ignoreCertificateErrors = getPreference('ignoreCertificateErrors');
  if (ignoreCertificateErrors) {
    // https://www.electronjs.org/docs/api/command-line-switches
    app.commandLine.appendSwitch('ignore-certificate-errors');
  }

  // Listen for transactions as soon as possible.
  inAppPurchase.on('transactions-updated', (event, transactions) => {
    if (!isMas() || !Array.isArray(transactions)) {
      return;
    }

    const iapPurchased = getPreference('iapPurchased');
    if (iapPurchased) return;

    // Check each transaction.
    transactions.forEach((transaction) => {
      const { payment } = transaction;

      // backward compatible
      if (payment.productIdentifier !== appJson.iapProductIdentifier) {
        return;
      }

      switch (transaction.transactionState) {
        case 'purchasing':
          // eslint-disable-next-line no-console
          console.log(`Purchasing ${payment.productIdentifier}...`);
          break;
        case 'purchased': {
          // eslint-disable-next-line no-console
          console.log(`${payment.productIdentifier} purchased.`);

          // Get the receipt url.
          // const receiptURL = inAppPurchase.getReceiptURL();

          // console.log(`Receipt URL: ${receiptURL}`);

          // Submit the receipt file to the server and check if it is valid.
          // @see https://developer.apple.com/library/content/releasenotes/General/ValidateAppStoreReceipt/Chapters/ValidateRemotely.html
          // ...
          // If the receipt is valid, the product is purchased
          // ...

          // Finish the transaction.
          dialog.showMessageBox(mainWindow.get(), {
            type: 'question',
            buttons: ['OK'],
            message: `You've purchased ${appJson.name} Plus successfully. Thank you for supporting us!`,
            cancelId: 0,
            defaultId: 0,
          }).catch(console.log); // eslint-disable-line

          setPreference('iapPurchased', true);
          inAppPurchase.finishTransactionByDate(transaction.transactionDate);
          break;
        }
        case 'failed':
          // eslint-disable-next-line no-console
          console.log(`Failed to purchase ${payment.productIdentifier}.`);

          // Finish the transaction.
          inAppPurchase.finishTransactionByDate(transaction.transactionDate);
          break;
        case 'restored':
          dialog.showMessageBox(mainWindow.get(), {
            type: 'question',
            buttons: ['OK'],
            message: `${appJson.name} Plus purchase has been restored. Thank you for supporting us!`,
            cancelId: 0,
            defaultId: 0,
          }).catch(console.log); // eslint-disable-line

          setPreference('iapPurchased', true);

          // eslint-disable-next-line no-console
          console.log(`The purchase of ${payment.productIdentifier} has been restored.`);
          break;
        case 'deferred':
          // eslint-disable-next-line no-console
          console.log(`The purchase of ${payment.productIdentifier} has been deferred.`);
          break;
        default:
          break;
      }
    });
  });

  // mock app.whenReady
  let trulyReady = false;
  ipcMain.once('truly-ready', () => { trulyReady = true; });
  const whenTrulyReady = () => {
    if (trulyReady) return Promise.resolve();
    return new Promise((resolve) => {
      ipcMain.once('truly-ready', () => {
        trulyReady = true;
        resolve();
      });
    });
  };

  const handleOpenUrl = (url) => {
    whenTrulyReady()
      .then(() => {
        const openWithPreferredBehavior = (link, workspaceId) => {
          const openProtocolUrlInNewWindow = getPreference('openProtocolUrlInNewWindow');
          if (openProtocolUrlInNewWindow === 'ask') {
            dialog.showMessageBox(mainWindow.get(), {
              type: 'question',
              buttons: ['Open in Main Window', 'Open in New Window', 'Cancel'],
              message: 'Where do you want to open the link?',
              cancelId: 2,
              defaultId: 0,
              checkboxLabel: 'Remember this preference',
              checkboxChecked: false,
            })
              .then(({ response, checkboxChecked }) => {
                if (response > 1) return;

                const openInNewWindow = response === 1;
                ipcMain.emit('request-load-url', null, link, workspaceId, openInNewWindow);

                if (checkboxChecked) {
                  setPreference(
                    'openProtocolUrlInNewWindow',
                    openInNewWindow ? 'newWindow' : 'mainWindow',
                  );
                }
              })
              .catch(console.log); // eslint-disable-line
            return;
          }

          ipcMain.emit('request-load-url', null, link, workspaceId, openProtocolUrlInNewWindow === 'newWindow');
        };

        // focus on window
        mainWindow.show();

        const workspaces = Object.values(getWorkspaces());

        if (workspaces.length < 1) return null;

        // handle webcal:
        if (url.startsWith('webcal:')) {
          const webcalWorkspaces = workspaces
            .filter((workspace) => extractHostname(
              workspace.homeUrl || appJson.url,
            ) in WEBCAL_URLS);

          // pick automically if there's only one choice
          if (webcalWorkspaces.length === 0) {
            ipcMain.emit(
              'request-show-message-box', null,
              `None of your ${getWorkspaceFriendlyName().toLowerCase()} supports accessing iCalendar files.`,
              'error',
            );
            return null;
          }
          if (webcalWorkspaces.length === 1) {
            const webcalUrl = WEBCAL_URLS[extractHostname(
              webcalWorkspaces[0].homeUrl || appJson.url,
            )];
            const u = webcalUrl.replace('%s', url);
            openWithPreferredBehavior(u, webcalWorkspaces[0].id);
            return null;
          }

          return openUrlWithWindow.show(url);
        }

        // handle mailto:
        if (url.startsWith('mailto:')) {
          const mailtoWorkspaces = workspaces
            .filter((workspace) => extractHostname(
              workspace.homeUrl || appJson.url,
            ) in MAILTO_URLS);

          // pick automically if there's only one choice
          if (mailtoWorkspaces.length === 0) {
            ipcMain.emit(
              'request-show-message-box', null,
              `None of your ${getWorkspaceFriendlyName().toLowerCase()} supports composing email messages.`,
              'error',
            );
            return null;
          }
          if (mailtoWorkspaces.length === 1) {
            const mailtoUrl = MAILTO_URLS[extractHostname(
              mailtoWorkspaces[0].homeUrl || appJson.url,
            )];
            const u = mailtoUrl.replace('%s', url);
            openWithPreferredBehavior(u, mailtoWorkspaces[0].id);
            return null;
          }

          return openUrlWithWindow.show(url);
        }

        // handle https/http
        // pick automically if there's only one choice
        if (workspaces.length === 1) {
          openWithPreferredBehavior(url, workspaces[0].id);
          return null;
        }

        return openUrlWithWindow.show(url);
      });
  };

  const handleArgv = (argv) => {
    if (argv.length <= 1) return;
    const url = argv.find((a) => a.startsWith('mailto:') || a.startsWith('http') || a.startsWith('https'));
    if (url) {
      handleOpenUrl(url);
    }
  };

  loadListeners();
  loadInvokers();

  const commonInit = () => {
    app.whenReady()
      // if app lock is in Keychain, lock the app at first launch
      .then(() => getAppLockStatusAsync())
      .then((appLockStatus) => {
        if (appLockStatus.hasPassword) {
          global.appLock = true;
          global.locked = true;
          if (appLockStatus.useTouchId) {
            whenTrulyReady()
              .then(() => {
                unlockAppUsingTouchId();
              });
          }
        }
      })
      .then(() => mainWindow.createAsync())
      .then(() => {
        const {
          themeSource,
          privacyConsentAsked,
          hibernateUnusedWorkspacesAtLaunch,
        } = getPreferences();

        nativeTheme.themeSource = themeSource;

        createMenu();

        nativeTheme.addListener('updated', () => {
          sendToAllWindows('native-theme-updated');
          reloadViewsDarkReader();
        });

        const workspaceObjects = getWorkspaces();

        Object.keys(workspaceObjects).forEach((id) => {
          const workspace = workspaceObjects[id];
          if (
            (hibernateUnusedWorkspacesAtLaunch || (
              global.hibernateWhenUnused && global.hibernateWhenUnusedTimeout === 0
            ))
            && !workspace.active
          ) {
            if (!workspace.hibernated) {
              setWorkspace(workspace.id, { hibernated: true });
            }
            return;
          }
          setWorkspace(workspace.id, { hibernated: false });
          addViewAsync(mainWindow.get(), workspace);
        });

        ipcMain.emit('request-update-pause-notifications-info');

        if (process.platform === 'darwin' && isStandalone() && app.runningUnderRosettaTranslation) {
          dialog.showMessageBox(mainWindow.get(), {
            type: 'question',
            buttons: ['Download Now', 'Later'],
            message: `You're running the x64 version of ${appJson.name}. For best performance, please download and install the arm64 version of the app.`,
            cancelId: 1,
            defaultId: 0,
          }).then(({ response }) => {
            if (response === 0) {
              shell.openExternal(`https://${appJson.hostname}`);
            }
          }).catch(console.log); // eslint-disable-line
        }

        if ((isMas() || isStandalone()) && !privacyConsentAsked) {
          dialog.showMessageBox(mainWindow.get(), {
            type: 'question',
            buttons: ['Allow', 'Don\'t Allow'],
            message: 'Can we collect anonymous usage statistics and crash reports?',
            detail: 'The data helps us improve and optimize the product. You can change your decision at any time in the app’s preferences.',
            cancelId: 1,
            defaultId: 0,
          }).then(({ response }) => {
            setPreference('privacyConsentAsked', true);
            if (response === 0) {
              setPreference('sentry', true);
              setPreference('telemetry', true);
            } else {
              setPreference('sentry', false);
              setPreference('telemetry', false);
            }
          }).catch(console.log); // eslint-disable-line
        }
      })
      .then(() => {
        // Fix webview is not resized automatically
        // when window is maximized on Linux
        // https://github.com/webcatalog/webcatalog-app/issues/561

        // run it here not in mainWindow.createAsync()
        // because if the `mainWindow` is maximized or minimized
        // before the workspaces's BrowserView fully loaded
        // error will occur
        // see https://github.com/webcatalog/webcatalog-app/issues/637
        const win = mainWindow.get();
        if (process.platform === 'linux') {
          const handleMaximize = () => {
            // getContentSize is not updated immediately
            // try once after 0.2s (for fast computer), another one after 1s (to be sure)
            setTimeout(() => {
              ipcMain.emit('request-realign-active-workspace');
            }, 200);
            setTimeout(() => {
              ipcMain.emit('request-realign-active-workspace');
            }, 1000);
          };
          win.on('maximize', handleMaximize);
          win.on('unmaximize', handleMaximize);
        }

        mainWindow.get().on('focus', () => {
          win.send('log-focus');
        });
      })
      .then(() => {
        // trigger whenTrulyReady;
        ipcMain.emit('truly-ready');

        setTimeout(() => {
          if (appJson.url && MAILTO_URLS[extractHostname(appJson.url)]) {
            promptSetAsDefaultMailClient();
          } else if (appJson.url && WEBCAL_URLS[extractHostname(appJson.url)]) {
            promptSetAsDefaultCalendarApp();
          }
        }, 1000);
      });
  };

  app.on('ready', () => {
    // https://github.com/electron/electron/issues/23757
    protocol.registerFileProtocol('file', (request, callback) => {
      const pathname = decodeURI(request.url.replace('file:///', ''));
      callback(pathname);
    });

    global.appJson = appJson;

    const {
      attachToMenubar,
      autoCheckForUpdates,
      blockAds,
      customUserAgent,
      extensionEnabledExtesionIds,
      extensionSourceBrowserId,
      extensionSourceProfileDirName,
      navigationBar,
      proxyAddress,
      proxyBypassRules,
      proxyMode,
      proxyPacScript,
      proxyPort,
      proxyProtocol,
      rememberLastPageVisited,
      runInBackground,
      shareWorkspaceBrowsingData,
      sidebar,
      sidebarSize,
      spellcheck,
      spellcheckLanguages,
      titleBar,
      trayIcon,
      useSystemTitleBar,
      windowButtons,
      hibernateWhenUnused,
      hibernateWhenUnusedTimeout,
    } = getPreferences();

    if (customUserAgent) {
      app.userAgentFallback = customUserAgent;
    } else {
      // Hide Electron from UA to improve compatibility
      // https://github.com/webcatalog/webcatalog-app/issues/182
      app.userAgentFallback = app.userAgentFallback
        // Fix WhatsApp requires Google Chrome 49+ bug
        // App Name doesn't have white space in user agent. 'Google Chat' app > GoogleChat/8.1.1
        .replace(` ${app.name.replace(/ /g, '')}/${app.getVersion()}`, '')
        // Hide Electron from UA to improve compatibility
        // https://github.com/webcatalog/webcatalog-app/issues/182
        .replace(` Electron/${process.versions.electron}`, '');
    }

    global.isMacOs11 = isMacOs11();
    global.isWindows10 = isWindows10();
    global.attachToMenubar = attachToMenubar;
    global.runInBackground = process.platform !== 'darwin' && runInBackground;
    global.sidebar = sidebar;
    global.sidebarSize = sidebarSize;
    global.titleBar = titleBar;
    global.trayIcon = trayIcon;
    global.navigationBar = navigationBar;
    global.useSystemTitleBar = useSystemTitleBar;
    global.windowButtons = windowButtons;
    global.MAILTO_URLS = MAILTO_URLS;
    global.WEBCAL_URLS = WEBCAL_URLS;
    // ensure that to change the preferences
    // user needs to restart the app
    // this is to ensure consistency between views
    global.blockAds = blockAds;
    global.rememberLastPageVisited = rememberLastPageVisited;
    global.shareWorkspaceBrowsingData = shareWorkspaceBrowsingData;
    global.spellcheck = spellcheck;
    global.spellcheckLanguages = spellcheckLanguages;
    global.proxyBypassRules = proxyBypassRules;
    global.proxyPacScript = proxyPacScript;
    global.proxyRules = `${proxyProtocol}://${proxyAddress}:${proxyPort || '80'}`;
    global.proxyMode = proxyMode;
    global.extensionEnabledExtesionIds = extensionEnabledExtesionIds;
    global.extensionSourceBrowserId = extensionSourceBrowserId;
    global.extensionSourceProfileDirName = extensionSourceProfileDirName;
    global.hibernateWhenUnused = hibernateWhenUnused;
    global.hibernateWhenUnusedTimeout = hibernateWhenUnusedTimeout;

    commonInit();

    whenTrulyReady()
      .then(() => {
        // handle protocols on Windows & Linux
        // on macOS, use 'open-url' event
        if (process.platform !== 'darwin') {
          handleArgv(process.argv);
        }

        if (autoCheckForUpdates) {
          if (isStandalone() && !isSnap()) {
            ipcMain.emit('request-check-for-updates', null, true);
          } else if (!isMas()) {
            // only notify user about update again after one week
            const lastShowNewUpdateDialog = getPreference('lastShowNewUpdateDialog');
            const updateInterval = 7 * 24 * 60 * 60 * 1000; // one week
            const now = Date.now();
            if (now - lastShowNewUpdateDialog > updateInterval) {
              fetchUpdater.checkForUpdates(true);
            }
          }
        }

        // pre-cache pricing for (Singlebox|...) Plus
        if (isMas() && !appJson.registered && !getPreference('iapPurchased')) {
          getIapFormattedPriceAsync(appJson.iapProductIdentifier);
        }
      });
  });

  let hasWarned = false;
  app.on('before-quit', (e) => {
    const handleBeforeQuit = () => {
      const win = mainWindow.get();
      if (win) {
        // https://github.com/atom/electron/issues/444#issuecomment-76492576
        win.forceClose = true;
        // fix https://github.com/webcatalog/webcatalog-app/issues/1141
        win.setBrowserView(null);
      }
    };

    const warnBeforeQuitting = getPreference('warnBeforeQuitting');
    if (warnBeforeQuitting) {
      if (!hasWarned) {
        e.preventDefault();
        dialog.showMessageBox(mainWindow.get(), {
          type: 'question',
          buttons: ['Yes', 'No'],
          message: 'Are you sure you want to quit the app?',
          cancelId: 1,
          defaultId: 1,
        }).then(({ response }) => {
          if (response === 0) {
            hasWarned = true;
            app.quit();
          }
        }).catch(console.log); // eslint-disable-line
      } else {
        hasWarned = false;
        handleBeforeQuit();
      }
      return;
    }

    handleBeforeQuit();
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin' && getPreference('runInBackground') !== true) {
      app.quit();
    }
  });

  app.on('activate', () => {
    const win = mainWindow.get();
    if (win == null) {
      commonInit();
    } else {
      mainWindow.show();
    }
  });

  // macOS only
  app.on('open-url', (e, url) => {
    e.preventDefault();

    handleOpenUrl(url);
  });

  app.on('second-instance', (e, argv) => {
    // Someone tried to run a second instance, we should focus our window.
    const win = mainWindow.get();
    if (win != null) {
      if (win.isMinimized()) win.restore();
      win.show();
    }

    // handle protocols on Windows & Linux
    // on macOS, use 'open-url' event
    if (process.platform !== 'darwin') {
      handleArgv(argv);
    }
  });

  app.on('login', (e, webContents, request, authInfo, callback) => {
    e.preventDefault();
    const sessId = String(Date.now());
    authWindow.show(sessId, request.url);

    const listener = (ee, id, success, username, password) => {
      if (id !== sessId) return;

      if (success) {
        callback(username, password);
      } else {
        callback();
      }

      ipcMain.removeListener('continue-auth', listener);
    };

    ipcMain.on('continue-auth', listener);
  });

  // lock the app when all windows blur for more than 5 minutes
  let lockAppTimeout;
  app.on('browser-window-focus', () => {
    clearTimeout(lockAppTimeout);
  });

  app.on('browser-window-blur', () => {
    lockAppTimeout = setTimeout(() => {
      let allBlurred = true;
      const wins = BrowserWindow.getAllWindows();
      for (let i = 0; i < wins.length; i += 1) {
        if (wins[i] && wins[i].isFocused()) {
          allBlurred = false;
          break;
        }
      }
      if (allBlurred) {
        ipcMain.emit('request-lock-app');
      }
    }, 5 * 60 * 1000);
  });

  // by default, castlabs/electron-releases terminates the app (process.exit(1))
  // if error occurs when installing Widevine
  // we overwrite that behavior here because widevine is not super important for us
  // and should not crash the app
  app.on('widevine-error', (error) => {
    // eslint-disable-next-line no-console
    console.log(`Widevine installation encountered an error: ${error}`);
  });
}
