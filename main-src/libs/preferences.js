/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const settings = require('electron-settings');
const { app, nativeTheme, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs-extra');

const sendToAllWindows = require('./send-to-all-windows');
const extractHostname = require('./extract-hostname');
const isMas = require('./is-mas');
const isWindows10 = require('./is-windows-10');

const MAILTO_URLS = require('../constants/mailto-urls');

const appJson = require('../constants/app-json');
const isWebcatalog = require('./is-webcatalog');

const getDefaultDownloadsPath = () => app.getPath('downloads');

const getDefaultPauseNotificationsByScheduleFrom = () => {
  const d = new Date();
  d.setHours(23);
  d.setMinutes(0);
  return d.toString();
};

const getDefaultPauseNotificationsByScheduleTo = () => {
  const d = new Date();
  d.setHours(7);
  d.setMinutes(0);
  return d.toString();
};

// scope
const v = '2018.2';

// show sidebar by default for Singlebox, multisite apps & mail apps
const shouldShowSidebar = !appJson.url || Boolean(MAILTO_URLS[extractHostname(appJson.url)]);

const defaultPreferences = {
  allowNodeInJsCodeInjection: false,
  alwaysOnTop: false, // for menubar
  autoHideMenuBar: false,
  // on macOS, save to ~/Downloads by default
  // because we can bounce the file in dock
  // also the save dialog is unreliable on macOS, f
  // for unknown reason, sometimes, it doesn't show up and gets stuck
  askForDownloadPath: process.platform !== 'darwin',
  attachToMenubar: false,
  autoCheckForUpdates: true,
  autoRefresh: false,
  autoRefreshInterval: 3600000,
  autoRefreshOnlyWhenInactive: false,
  blockAds: false,
  cssCodeInjection: null,
  customUserAgent: null,
  // default Dark Reader settings from its Chrome extension */
  darkReader: appJson.id === 'clovery',
  darkReaderBrightness: 100,
  darkReaderContrast: 100,
  darkReaderGrayscale: 0,
  darkReaderSepia: 0,
  // default Dark Reader settings from its Chrome extension */
  /* Font Settings (same as Chrome/Edge) */
  defaultFontSize: 16,
  defaultFontSizeMinimum: 0,
  defaultFontSizeMonospace: 13,
  /* audio & video */
  // deviceId is not constant
  // so use label for now
  defaultAudioInputDeviceLabel: null,
  defaultAudioOutputDeviceLabel: null,
  defaultVideoInputDeviceLabel: null,
  /* Font Settings (same as Chrome/Edge) */
  downloadPath: getDefaultDownloadsPath(),
  // extensions
  extensionSourceBrowserId: process.platform === 'win32' ? 'edge' : 'chrome',
  extensionSourceProfileDirName: 'Default',
  extensionEnabledExtesionIds: {},
  hibernateUnusedWorkspacesAtLaunch: false,
  hibernateWhenUnused: false,
  hibernateWhenUnusedTimeout: 0,
  iapPurchased: false,
  ignoreCertificateErrors: false,
  internalUrlRule: '',
  externalUrlRule: '',
  jsCodeInjection: null,
  lastShowNewUpdateDialog: 0,
  navigationBar: false,
  muteApp: false,
  openFolderWhenDoneDownloading: true,
  openProtocolUrlInNewWindow: 'ask', // 'ask', 'newWindow', 'mainWindow'
  pauseNotifications: null,
  pauseNotificationsBySchedule: false,
  pauseNotificationsByScheduleFrom: getDefaultPauseNotificationsByScheduleFrom(),
  pauseNotificationsByScheduleTo: getDefaultPauseNotificationsByScheduleTo(),
  pauseNotificationsMuteAudio: false,
  privacyConsentAsked: false,
  proxyAddress: '',
  proxyBypassRules: '',
  proxyPacScript: '',
  proxyPort: '',
  proxyProtocol: 'socks5',
  proxyMode: 'direct', // direct, pac_script, fixed_servers, system
  ratingDidRate: false,
  ratingLastClicked: 0,
  rememberLastPageVisited: false,
  runInBackground: false,
  searchEngine: 'duckduckgo',
  sentry: false,
  // branded apps (like Google/Microsoft) share browsing data by default
  // https://github.com/webcatalog/webcatalog-app/issues/986
  shareWorkspaceBrowsingData: appJson.id.startsWith('group-') || appJson.id === 'clovery',
  sidebar: shouldShowSidebar,
  sidebarSize: 'compact',
  sidebarTips: 'shortcut',
  skipAskingDefaultCalendarClient: false,
  skipAskingDefaultMailClient: false,
  spellcheck: true,
  spellcheckLanguages: ['en-US'],
  standaloneLicenseKey: undefined,
  standaloneRegistered: false,
  swipeToNavigate: true,
  telemetry: false,
  themeColor: 'auto',
  themeSource: 'system',
  titleBar: true,
  trayIcon: false,
  unreadCountBadge: true,
  useHardwareAcceleration: true,
  // use system title bar by default on Windows 8 & Windows 7
  // because on Windows 10, it's normally for apps not to have border
  // but on prior versions of Windows, apps have border
  // system title bar pref is required for the app have the native border
  useSystemTitleBar: process.platform === 'win32' && !isWindows10(),
  warnBeforeQuitting: false,
  windowButtons: true, // traffic light buttons on macOS
};

let cachedPreferences = null;

const initCachedPreferences = () => {
  cachedPreferences = {
    ...defaultPreferences,
    ...settings.getSync(`preferences.${v}`),
  };

  // shared-preferences.json includes:
  // telemetry & sentry pref
  // so that privacy consent prefs
  // can be shared across WebCatalog and WebCatalog-Engine-based apps
  // ignore this if error occurs
  // so the more important initialization process can proceed
  if (isWebcatalog()) {
    const sharedPreferences = {
      telemetry: false,
      sentry: false,
    };

    try {
      const sharedPreferencesPath = path.join(app.getPath('home'), '.webcatalog', 'shared-preferences.json');
      if (fs.existsSync(sharedPreferencesPath)) {
        const jsonContent = fs.readJsonSync(sharedPreferencesPath);
        sharedPreferences.telemetry = Boolean(jsonContent.telemetry);
        sharedPreferences.sentry = Boolean(jsonContent.sentry);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }

    cachedPreferences = {
      ...cachedPreferences,
      ...sharedPreferences,
    };
  }

  // this feature used to be free on MAS
  // so we need this code to deactivate it for free users
  // note: this feature is always free witH WebCatalog
  if (isMas() && !appJson.registered && !cachedPreferences.iapPurchased) {
    cachedPreferences.attachToMenubar = false;
  }
};

const getPreferences = () => {
  // trigger electron-settings before app ready might fails
  // so catch with default pref as fallback
  // https://github.com/nathanbuchar/electron-settings/issues/111
  try {
    // store in memory to boost performance
    if (cachedPreferences == null) {
      initCachedPreferences();
    }
    return cachedPreferences;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return defaultPreferences;
  }
};

const getPreference = (name) => {
  // trigger electron-settings before app ready might fails
  // so catch with default pref as fallback
  // https://github.com/nathanbuchar/electron-settings/issues/111
  try {
    // store in memory to boost performance
    if (cachedPreferences == null) {
      initCachedPreferences();
    }
    return cachedPreferences[name];
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return defaultPreferences[name];
  }
};

const hasPreference = (name) => settings.hasSync(`preferences.${v}.${name}`);

const setPreference = (name, value) => {
  sendToAllWindows('set-preference', name, value);
  cachedPreferences[name] = value;

  settings.setSync(`preferences.${v}.${name}`, value);

  if (name.startsWith('darkReader')) {
    ipcMain.emit('request-reload-views-dark-reader');
  }

  if (name.startsWith('pauseNotifications')) {
    ipcMain.emit('request-update-pause-notifications-info');
  }

  if (name === 'themeSource') {
    nativeTheme.themeSource = value;
  }

  if (name === 'muteApp') {
    ipcMain.emit('request-set-views-audio-prefs');
    ipcMain.emit('create-menu');
  }

  if (name === 'unreadCountBadge') {
    ipcMain.emit('request-refresh-badge-count');
  }
};

const resetPreferences = () => {
  cachedPreferences = null;
  settings.setSync(`preferences.${v}`, {});

  const preferences = getPreferences();
  sendToAllWindows('set-preferences', preferences);
};

module.exports = {
  getPreference,
  getPreferences,
  hasPreference,
  resetPreferences,
  setPreference,
};
