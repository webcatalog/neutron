const path = require('path');
const settings = require('electron-settings');
const { app, nativeTheme, ipcMain } = require('electron');

const sendToAllWindows = require('./send-to-all-windows');
const extractHostname = require('./extract-hostname');

const MAILTO_URLS = require('../constants/mailto-urls');

const appJson = require('../app.json');

const getDefaultDownloadsPath = () => path.join(app.getPath('home'), 'Downloads');

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

const defaultPreferences = {
  allowNodeInJsCodeInjection: false,
  askForDownloadPath: true,
  attachToMenubar: false,
  autoCheckForUpdates: true,
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
  jsCodeInjection: null,
  lastCheckForUpdates: 0,
  navigationBar: false,
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
  shareWorkspaceBrowsingData: false,
  sidebar: !appJson.url || Boolean(MAILTO_URLS[extractHostname(appJson.url)]),
  spellcheck: true,
  spellcheckLanguages: ['en-US'],
  swipeToNavigate: true,
  themeSource: 'system',
  titleBar: true,
  unreadCountBadge: true,
  useHardwareAcceleration: true,
};

let cachedPreferences = null;

const initCachedPreferences = () => {
  cachedPreferences = { ...defaultPreferences, ...settings.get(`preferences.${v}`) };
};

const getPreferences = () => {
  // store in memory to boost performance
  if (cachedPreferences == null) {
    initCachedPreferences();
  }
  return cachedPreferences;
};

const getPreference = (name) => {
  // store in memory to boost performance
  if (cachedPreferences == null) {
    initCachedPreferences();
  }
  return cachedPreferences[name];
};

const isPreferenceUnset = (name) => settings.get(`preferences.${v}.${name}`) == null;

const setPreference = (name, value) => {
  sendToAllWindows('set-preference', name, value);
  cachedPreferences[name] = value;

  Promise.resolve().then(() => settings.set(`preferences.${v}.${name}`, value));

  if (name.startsWith('darkReader')) {
    ipcMain.emit('request-reload-views-dark-reader');
  }

  if (name.startsWith('pauseNotifications')) {
    ipcMain.emit('request-update-pause-notifications-info');
  }

  if (name === 'themeSource') {
    nativeTheme.themeSource = value;
  }
};

const resetPreferences = () => {
  cachedPreferences = null;
  settings.deleteAll();
  const preferences = getPreferences();
  Object.keys(preferences).forEach((name) => {
    sendToAllWindows('set-preference', name, preferences[name]);
  });
};

module.exports = {
  getPreference,
  getPreferences,
  isPreferenceUnset,
  resetPreferences,
  setPreference,
};
