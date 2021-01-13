/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const settings = require('electron-settings');
const { app, nativeTheme, ipcMain } = require('electron');

const sendToAllWindows = require('./send-to-all-windows');
const extractHostname = require('./extract-hostname');

const MAILTO_URLS = require('../constants/mailto-urls');

const appJson = require('../app.json');

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
  darkReader: false,
  darkReaderBrightness: 100,
  darkReaderContrast: 100,
  darkReaderGrayscale: 0,
  darkReaderSepia: 0,
  // default Dark Reader settings from its Chrome extension */
  downloadPath: getDefaultDownloadsPath(),
  hibernateUnusedWorkspacesAtLaunch: false,
  hideMenuBar: false,
  ignoreCertificateErrors: false,
  internalUrlRule: '',
  jsCodeInjection: null,
  lastShowNewUpdateDialog: 0,
  licenseKey: null,
  navigationBar: false,
  muteApp: false,
  openFolderWhenDoneDownloading: false,
  pauseNotifications: null,
  pauseNotificationsBySchedule: false,
  pauseNotificationsByScheduleFrom: getDefaultPauseNotificationsByScheduleFrom(),
  pauseNotificationsByScheduleTo: getDefaultPauseNotificationsByScheduleTo(),
  pauseNotificationsMuteAudio: false,
  proxyBypassRules: '',
  proxyPacScript: '',
  proxyRules: '',
  proxyType: 'none',
  rememberLastPageVisited: false,
  runInBackground: false,
  searchEngine: 'google',
  sentry: true,
  // branded apps (like Google/Microsoft) share browsing data by default
  // https://github.com/webcatalog/webcatalog-app/issues/986
  shareWorkspaceBrowsingData: appJson.id.startsWith('group-'),
  sidebar: shouldShowSidebar,
  sidebarTips: 'shortcut',
  sidebarSize: 'compact',
  skipAskingDefaultMailClient: false,
  spellcheck: true,
  spellcheckLanguages: ['en-US'],
  swipeToNavigate: true,
  telemetry: true,
  themeSource: 'system',
  titleBar: !shouldShowSidebar, // if sidebar is shown, then hide titleBar
  trayIcon: false,
  unreadCountBadge: true,
  useHardwareAcceleration: true,
  useSystemTitleBar: false,
  warnBeforeQuitting: false,
};

let cachedPreferences = null;

const initCachedPreferences = () => {
  cachedPreferences = { ...defaultPreferences, ...settings.getSync(`preferences.${v}`) };

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
  settings.unsetSync();
  const preferences = getPreferences();
  Object.keys(preferences).forEach((name) => {
    sendToAllWindows('set-preference', name, preferences[name]);
  });
};

module.exports = {
  getPreference,
  getPreferences,
  hasPreference,
  resetPreferences,
  setPreference,
};
