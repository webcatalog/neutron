/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { ipcRenderer } from 'electron';

import amplitude from '../amplitude';

export const enqueueRequestRestartSnackbar = () => {
  if (window.mode === 'workspace-preferences' || window.mode === 'preferences') {
    ipcRenderer.emit('enqueue-request-restart-snackbar');
    return;
  }
  ipcRenderer.send('request-enqueue-request-restart-snackbar');
};

export const requestOpenInBrowser = (url) => ipcRenderer.send('request-open-in-browser', url);
export const requestLoadUrl = (url, id, openInNewWindow) => ipcRenderer.send('request-load-url', url, id, openInNewWindow);
export const requestShowMessageBox = (message, type) => ipcRenderer.send('request-show-message-box', message, type);
export const requestShowAppMenu = (x, y) => ipcRenderer.send('request-show-app-menu', x, y);
export const requestShowAppMiniMenu = (x, y) => ipcRenderer.send('request-show-app-mini-menu', x, y);
export const requestShowRequireLicenseDialog = () => ipcRenderer.send('request-show-require-license-dialog');
export const requestRestorePurchase = () => ipcRenderer.send('request-restore-purchase');

export const requestGoHome = () => ipcRenderer.send('request-go-home');
export const requestGoBack = () => ipcRenderer.send('request-go-back');
export const requestGoForward = () => ipcRenderer.send('request-go-forward');
export const requestReload = () => ipcRenderer.send('request-reload');

export const requestQuit = () => ipcRenderer.send('request-quit');
export const requestCheckForUpdates = () => ipcRenderer.send('request-check-for-updates');

export const requestShowAddWorkspaceWindow = () => ipcRenderer.send('request-show-add-workspace-window');
export const requestShowNotificationsWindow = () => ipcRenderer.send('request-show-notifications-window');
export const requestShowPreferencesWindow = (scrollTo) => ipcRenderer.send('request-show-preferences-window', scrollTo);
export const requestShowWorkspacePreferencesWindow = (id) => ipcRenderer.send('request-show-workspace-preferences-window', id);

// Notifications
export const requestShowNotification = (opts) => ipcRenderer.send('request-show-notification', opts);
export const requestUpdatePauseNotificationsInfo = () => ipcRenderer.send('request-update-pause-notifications-info');
export const getPauseNotificationsInfo = () => ipcRenderer.sendSync('get-pause-notifications-info');

// Preferences
export const getPreference = (name) => ipcRenderer.sendSync('get-preference', name);
export const getPreferences = () => ipcRenderer.sendSync('get-preferences');
export const requestSetPreference = (name, value) => ipcRenderer.send('request-set-preference', name, value);
export const requestResetPreferences = () => ipcRenderer.send('request-reset-preferences');
export const requestRestart = () => ipcRenderer.send('request-restart');

// System Preferences
export const getSystemPreference = (name) => ipcRenderer.sendSync('get-system-preference', name);
export const getSystemPreferences = () => ipcRenderer.sendSync('get-system-preferences');
export const requestSetSystemPreference = (name, value) => ipcRenderer.send('request-set-system-preference', name, value);

// Workspace
export const getWorkspace = (id) => ipcRenderer.sendSync('get-workspace', id);
export const getWorkspacePreference = (id, preferenceName) => ipcRenderer.sendSync('get-workspace-preference', id, preferenceName);
export const getWorkspacePreferences = (id) => ipcRenderer.sendSync('get-workspace-preferences', id);
export const getWorkspaces = () => ipcRenderer.sendSync('get-workspaces');
export const requestClearBrowsingData = () => ipcRenderer.send('request-clear-browsing-data');
export const requestCreateWorkspace = (workspaceObj) => {
  // only log event type to protect privacy
  amplitude.getInstance().logEvent('webcatalog-engine: add workspace');
  ipcRenderer.send('request-create-workspace', workspaceObj);
};
export const requestTrackAddWorkspace = (deviceId, appId) => ipcRenderer.send('request-track-add-workspace', deviceId, appId);
export const requestHibernateWorkspace = (id, timeout) => ipcRenderer.send('request-hibernate-workspace', id, timeout);
export const requestOpenUrlInWorkspace = (url, id) => ipcRenderer.send('request-open-url-in-workspace', url, id);
export const requestRealignActiveWorkspace = () => ipcRenderer.send('request-realign-active-workspace');
export const requestRemoveWorkspace = (id) => {
  // only log event type to protect privacy
  amplitude.getInstance().logEvent('webcatalog-engine: remove workspace');
  ipcRenderer.send('request-remove-workspace', id);
};
export const requestClearWorkspaceBrowsingData = (id) => ipcRenderer.send('request-clear-workspace-browsing-data', id);
export const requestRemoveWorkspacePicture = (id) => ipcRenderer.send('request-remove-workspace-picture', id);
export const requestSetActiveWorkspace = (id) => {
  // only log event type to protect privacy
  amplitude.getInstance().logEvent('webcatalog-engine: set active workspace');
  ipcRenderer.send('request-set-active-workspace', id);
};
export const requestSetWorkspace = (id, opts) => ipcRenderer.send('request-set-workspace', id, opts);
export const requestSetWorkspaces = (workspaces) => ipcRenderer.send('request-set-workspaces', workspaces);
export const requestWakeUpWorkspace = (id) => ipcRenderer.send('request-wake-up-workspace', id);
export const requestReloadViewsDarkReader = () => ipcRenderer.send('request-reload-views-dark-reader');
export const requestReloadViewDarkReader = (id) => ipcRenderer.send('request-reload-view-dark-reader', id);
export const requestReloadWorkspace = (id) => ipcRenderer.send('request-reload-workspace', id);
export const requestShowReloadWorkspaceDialog = (id) => ipcRenderer.send('request-show-require-reload-workspace-dialog', id);
export const requestSetViewsAudioPrefs = () => ipcRenderer.send('request-set-views-audio-prefs');

// Workspace Meta
export const getWorkspaceMeta = (id) => ipcRenderer.sendSync('get-workspace-meta', id);
export const getWorkspaceMetas = () => ipcRenderer.sendSync('get-workspace-metas');
export const requestBadgeCount = () => ipcRenderer.send('refresh-badge-count');

// Find In Page
export const requestFindInPage = (text, forward) => ipcRenderer.send('request-find-in-page', text, forward);
export const requestStopFindInPage = (close) => ipcRenderer.send('request-stop-find-in-page', close);

// Auth
export const requestValidateAuthIdentity = (windowId, username, password) => ipcRenderer.send('request-validate-auth-identity', windowId, username, password);

// Native Theme
export const getShouldUseDarkColors = () => ipcRenderer.sendSync('get-should-use-dark-colors');

// Online Status
export const signalOnlineStatusChanged = (online) => ipcRenderer.send('online-status-changed', online);

// App Lock
export const requestLockApp = () => ipcRenderer.send('request-lock-app');
export const requestUnlockApp = (password) => ipcRenderer.send('request-unlock-app', password);
export const requestUnlockAppUsingTouchId = () => ipcRenderer.send('request-unlock-app-using-touch-id');

// Share Menu
export const requestShowShareMenu = () => ipcRenderer.send('request-show-share-menu');

// Tabs
export const requestAddWorkspaceTab = (workspaceId, tabObj) => ipcRenderer.send('request-add-workspace-tab', workspaceId, tabObj);
export const requestRemoveWorkspaceTab = (workspaceId, tabId) => ipcRenderer.send('request-remove-workspace-tab', workspaceId, tabId);
