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
  askForDownloadPath: true,
  attachToMenubar: false,
  autoCheckForUpdates: true,
  autoRefresh: false,
  autoRefreshInterval: 3600000,
  autoRefreshOnlyWhenInactive: false,
  blockAds: false,
  cssCodeInjection: null,
  customUserAgent: null,
  // default Dark Reader settings from its Chrome extension */
  darkReader: appJson.id === 'dynamail' || appJson.id === 'panmail',
  darkReaderBrightness: 100,
  darkReaderContrast: 100,
  darkReaderGrayscale: 0,
  darkReaderSepia: 0,
  // default Dark Reader settings from its Chrome extension */
  downloadPath: getDefaultDownloadsPath(),
  hibernateUnusedWorkspacesAtLaunch: false,
  iapPurchased: false,
  ignoreCertificateErrors: false,
  internalUrlRule: '',
  jsCodeInjection: null,
  lastShowNewUpdateDialog: 0,
  navigationBar: false,
  muteApp: false,
  openFolderWhenDoneDownloading: false,
  pauseNotifications: null,
  pauseNotificationsBySchedule: false,
  pauseNotificationsByScheduleFrom: getDefaultPauseNotificationsByScheduleFrom(),
  pauseNotificationsByScheduleTo: getDefaultPauseNotificationsByScheduleTo(),
  pauseNotificationsMuteAudio: false,
  privacyConsentAsked: false,
  proxyBypassRules: '',
  proxyPacScript: '',
  proxyRules: '',
  proxyType: 'none',
  ratingDidRate: false,
  ratingLastClicked: 0,
  rememberLastPageVisited: false,
  runInBackground: false,
  searchEngine: 'google',
  sentry: false,
  // branded apps (like Google/Microsoft) share browsing data by default
  // https://github.com/webcatalog/webcatalog-app/issues/986
  shareWorkspaceBrowsingData: appJson.id.startsWith('group-') || appJson.id === 'clovery',
  sidebar: shouldShowSidebar,
  sidebarSize: 'compact',
  sidebarTips: 'shortcut',
  skipAskingDefaultMailClient: false,
  spellcheck: true,
  spellcheckLanguages: ['en-US'],
  swipeToNavigate: true,
  telemetry: false,
  themeSource: 'system',
  titleBar: !shouldShowSidebar, // if sidebar is shown, then hide titleBar
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
  // shared-preferences.json includes:
  // telemetry & sentry pref
  // so that privacy consent prefs
  // can be shared across WebCatalog and WebCatalog-Engine-based apps
  const sharedPreferencesPath = path.join(app.getPath('home'), '.webcatalog', 'shared-preferences.json');
  let sharedPreferences = {
    telemetry: false,
    sentry: false,
  };
  if (!isMas() && fs.existsSync(sharedPreferencesPath)) {
    sharedPreferences = {
      ...sharedPreferences,
      ...fs.readJsonSync(sharedPreferencesPath),
    };
  }

  cachedPreferences = {
    ...defaultPreferences,
    ...settings.getSync(`preferences.${v}`),
    ...sharedPreferences,
  };

  // disable menu bar mode on Windows/Linux
  if (process.platform !== 'darwin') {
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
  } catch {
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
  } catch {
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
