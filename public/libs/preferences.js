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
  askForDownloadPath: true,
  attachToMenubar: false,
  autoCheckForUpdates: true,
  autoRefresh: false,
  autoRefreshInterval: 3600000,
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
  pauseNotifications: null,
  pauseNotificationsBySchedule: false,
  pauseNotificationsByScheduleFrom: getDefaultPauseNotificationsByScheduleFrom(),
  pauseNotificationsByScheduleTo: getDefaultPauseNotificationsByScheduleTo(),
  pauseNotificationsMuteAudio: false,
  proxyBypassRules: '',
  proxyPacScript: '',
  proxyRules: '',
  proxyType: 'none',
  registered: false,
  rememberLastPageVisited: false,
  searchEngine: 'google',
  sentry: true,
  shareWorkspaceBrowsingData: false,
  sidebar: shouldShowSidebar,
  sidebarShortcutHints: true,
  spellcheck: true,
  spellcheckLanguages: ['en-US'],
  swipeToNavigate: true,
  telemetry: true,
  themeSource: 'system',
  titleBar: !shouldShowSidebar, // if sidebar is shown, then hide titleBar
  unreadCountBadge: true,
  useHardwareAcceleration: true,
};

let cachedPreferences = null;

const initCachedPreferences = () => {
  cachedPreferences = { ...defaultPreferences, ...settings.getSync(`preferences.${v}`) };
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

  if (name === 'registered') {
    ipcMain.emit('create-menu');
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
