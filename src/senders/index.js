/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import amplitude from '../amplitude';

export const enqueueRequestRestartSnackbar = () => {
  if (window.mode === 'workspace-preferences' || window.mode === 'preferences') {
    window.ipcRenderer.emit('enqueue-request-restart-snackbar');
    return;
  }
  window.ipcRenderer.send('request-enqueue-request-restart-snackbar');
};

export const requestOpenInBrowser = (url) => window.ipcRenderer.send('request-open-in-browser', url);
export const requestLoadUrl = (url, id, openInNewWindow) => window.ipcRenderer.send('request-load-url', url, id, openInNewWindow);
export const requestShowMessageBox = (message, type) => window.ipcRenderer.send('request-show-message-box', message, type);
export const requestShowAppMenu = (x, y) => window.ipcRenderer.send('request-show-app-menu', x, y);
export const requestShowRequireLicenseDialog = () => window.ipcRenderer.send('request-show-require-license-dialog');

export const requestGoHome = () => window.ipcRenderer.send('request-go-home');
export const requestGoBack = () => window.ipcRenderer.send('request-go-back');
export const requestGoForward = () => window.ipcRenderer.send('request-go-forward');
export const requestReload = () => window.ipcRenderer.send('request-reload');

export const requestQuit = () => window.ipcRenderer.send('request-quit');
export const requestCheckForUpdates = () => window.ipcRenderer.send('request-check-for-updates');

export const requestShowAddWorkspaceWindow = () => window.ipcRenderer.send('request-show-add-workspace-window');
export const requestShowNotificationsWindow = () => window.ipcRenderer.send('request-show-notifications-window');
export const requestShowOpenSourceNoticesWindow = () => window.ipcRenderer.send('request-show-open-source-notices-window');
export const requestShowPreferencesWindow = (scrollTo) => window.ipcRenderer.send('request-show-preferences-window', scrollTo);
export const requestShowWorkspacePreferencesWindow = (id) => window.ipcRenderer.send('request-show-workspace-preferences-window', id);

// Notifications
export const requestShowNotification = (opts) => window.ipcRenderer.send('request-show-notification', opts);
export const requestUpdatePauseNotificationsInfo = () => window.ipcRenderer.send('request-update-pause-notifications-info');
export const getPauseNotificationsInfo = () => window.ipcRenderer.sendSync('get-pause-notifications-info');

// Preferences
export const getPreference = (name) => window.ipcRenderer.sendSync('get-preference', name);
export const getPreferences = () => window.ipcRenderer.sendSync('get-preferences');
export const requestSetPreference = (name, value) => window.ipcRenderer.send('request-set-preference', name, value);
export const requestResetPreferences = () => window.ipcRenderer.send('request-reset-preferences');
export const requestRestart = () => window.ipcRenderer.send('request-restart');

// System Preferences
export const getSystemPreference = (name) => window.ipcRenderer.sendSync('get-system-preference', name);
export const getSystemPreferences = () => window.ipcRenderer.sendSync('get-system-preferences');
export const requestSetSystemPreference = (name, value) => window.ipcRenderer.send('request-set-system-preference', name, value);

// Workspace
export const getWorkspace = (id) => window.ipcRenderer.sendSync('get-workspace', id);
export const getWorkspacePreference = (id, preferenceName) => window.ipcRenderer.sendSync('get-workspace-preference', id, preferenceName);
export const getWorkspacePreferences = (id) => window.ipcRenderer.sendSync('get-workspace-preferences', id);
export const getWorkspaces = () => window.ipcRenderer.sendSync('get-workspaces');
export const requestClearBrowsingData = () => window.ipcRenderer.send('request-clear-browsing-data');
export const requestCreateWorkspace = (workspaceObj) => {
  // only log event type to protect privacy
  amplitude.getInstance().logEvent('webcatalog-engine: add workspace');
  window.ipcRenderer.send('request-create-workspace', workspaceObj);
};
export const requestTrackAddWorkspace = (deviceId, appId) => window.ipcRenderer.send('request-track-add-workspace', deviceId, appId);
export const requestHibernateWorkspace = (id, timeout) => window.ipcRenderer.send('request-hibernate-workspace', id, timeout);
export const requestOpenUrlInWorkspace = (url, id) => window.ipcRenderer.send('request-open-url-in-workspace', url, id);
export const requestRealignActiveWorkspace = () => window.ipcRenderer.send('request-realign-active-workspace');
export const requestRemoveWorkspace = (id) => {
  // only log event type to protect privacy
  amplitude.getInstance().logEvent('webcatalog-engine: remove workspace');
  window.ipcRenderer.send('request-remove-workspace', id);
};
export const requestRemoveWorkspacePicture = (id) => window.ipcRenderer.send('request-remove-workspace-picture', id);
export const requestSetActiveWorkspace = (id) => {
  // only log event type to protect privacy
  amplitude.getInstance().logEvent('webcatalog-engine: set active workspace');
  window.ipcRenderer.send('request-set-active-workspace', id);
};
export const requestSetWorkspace = (id, opts) => window.ipcRenderer.send('request-set-workspace', id, opts);
export const requestSetWorkspaces = (workspaces) => window.ipcRenderer.send('request-set-workspaces', workspaces);
export const requestWakeUpWorkspace = (id) => window.ipcRenderer.send('request-wake-up-workspace', id);
export const requestReloadViewsDarkReader = () => window.ipcRenderer.send('request-reload-views-dark-reader');
export const requestReloadViewDarkReader = (id) => window.ipcRenderer.send('request-reload-view-dark-reader', id);
export const requestRequestReloadWorkspaceDialog = (id) => window.ipcRenderer.send('request-show-require-reload-workspace-dialog', id);
export const requestSetViewsAudioPrefs = () => window.ipcRenderer.send('request-set-views-audio-prefs');

// Workspace Meta
export const getWorkspaceMeta = (id) => window.ipcRenderer.sendSync('get-workspace-meta', id);
export const getWorkspaceMetas = () => window.ipcRenderer.sendSync('get-workspace-metas');
export const requestBadgeCount = () => window.ipcRenderer.send('refresh-badge-count');

// Find In Page
export const requestFindInPage = (text, forward) => window.ipcRenderer.send('request-find-in-page', text, forward);
export const requestStopFindInPage = (close) => window.ipcRenderer.send('request-stop-find-in-page', close);

// Auth
export const requestValidateAuthIdentity = (windowId, username, password) => window.ipcRenderer.send('request-validate-auth-identity', windowId, username, password);

// Native Theme
export const getShouldUseDarkColors = () => window.ipcRenderer.sendSync('get-should-use-dark-colors');

// Online Status
export const signalOnlineStatusChanged = (online) => window.ipcRenderer.send('online-status-changed', online);

// App Lock
export const requestLockApp = () => window.ipcRenderer.send('request-lock-app');
export const requestUnlockApp = (password) => window.ipcRenderer.send('request-unlock-app', password);
export const requestUnlockAppUsingTouchId = () => window.ipcRenderer.send('request-unlock-app-using-touch-id');

// Share Menu
export const requestShowShareMenu = () => window.ipcRenderer.send('request-show-share-menu');
