/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { ipcRenderer } from 'electron';

import { setPreference, setPreferences } from '../state/preferences/actions';
import { setSystemPreference } from '../state/system-preferences/actions';
import { setWorkspace, setWorkspaces } from '../state/workspaces/actions';
import { setWorkspaceMeta, setWorkspaceMetas } from '../state/workspace-metas/actions';
import { setWorkspaceTab, setWorkspaceTabs } from '../state/workspace-tabs/actions';
import {
  updateAddressBarInfo,
  updateCanGoBack,
  updateCanGoForward,
  updateIsFullScreen,
  updateIsMaximized,
  updateShouldUseDarkColors,
  updateTitle,
  updateLocked,
} from '../state/general/actions';
import {
  closeFindInPage,
  openFindInPage,
  updateFindInPageMatches,
} from '../state/find-in-page/actions';
import {
  updatePauseNotificationsInfo,
} from '../state/notifications/actions';
import { updateUpdater } from '../state/updater/actions';

import {
  getShouldUseDarkColors,
  requestFindInPage,
  signalOnlineStatusChanged,
} from '../senders';

const loadListeners = (store) => {
  if (window.mode === 'main') {
    // automatically reload page when wifi/network is connected
    // https://www.electronjs.org/docs/tutorial/online-offline-events
    const handleOnlineOffline = () => signalOnlineStatusChanged(window.navigator.onLine);
    window.addEventListener('online', handleOnlineOffline);
    window.addEventListener('offline', handleOnlineOffline);
  }

  ipcRenderer.on('log', (e, message) => {
    // eslint-disable-next-line
    if (message) console.log(message);
  });

  ipcRenderer.on('set-preference', (e, name, value) => {
    store.dispatch(setPreference(name, value));
  });

  ipcRenderer.on('set-preferences', (e, newState) => {
    store.dispatch(setPreferences(newState));
  });

  ipcRenderer.on('set-system-preference', (e, name, value) => {
    store.dispatch(setSystemPreference(name, value));
  });

  ipcRenderer.on('set-workspace', (e, id, value) => {
    store.dispatch(setWorkspace(id, value));
  });

  ipcRenderer.on('set-workspaces', (e, newWorkspaces) => {
    store.dispatch(setWorkspaces(newWorkspaces));
  });

  // meta
  ipcRenderer.on('set-workspace-meta', (e, id, value) => {
    store.dispatch(setWorkspaceMeta(id, value));
  });

  ipcRenderer.on('set-workspace-metas', (e, newWorkspaceMetas) => {
    store.dispatch(setWorkspaceMetas(newWorkspaceMetas));
  });

  // tabs
  ipcRenderer.on('set-workspace-tab', (e, workspaceId, tabId, value) => {
    store.dispatch(setWorkspaceTab(workspaceId, tabId, value));
  });

  ipcRenderer.on('set-workspace-tabs', (e, newWorkspaceTabs) => {
    store.dispatch(setWorkspaceTabs(newWorkspaceTabs));
  });

  ipcRenderer.on('update-can-go-back', (e, value) => {
    store.dispatch(updateCanGoBack(value));
  });

  ipcRenderer.on('update-can-go-forward', (e, value) => {
    store.dispatch(updateCanGoForward(value));
  });

  ipcRenderer.on('update-address', (e, address, edited) => {
    store.dispatch(updateAddressBarInfo(address, edited));
  });

  ipcRenderer.on('update-title', (e, title) => {
    store.dispatch(updateTitle(title));
  });

  // Find In Page
  ipcRenderer.on('open-find-in-page', () => {
    store.dispatch(openFindInPage());
  });

  ipcRenderer.on('close-find-in-page', () => {
    store.dispatch(closeFindInPage());
  });

  ipcRenderer.on('update-find-in-page-matches', (e, activeMatch, matches) => {
    store.dispatch(updateFindInPageMatches(activeMatch, matches));
  });

  // send back a request with text
  ipcRenderer.on('request-back-find-in-page', (e, forward) => {
    const { open, text } = store.getState().findInPage;
    if (!open) return;
    requestFindInPage(text, forward);
  });

  ipcRenderer.on('native-theme-updated', () => {
    store.dispatch(updateShouldUseDarkColors(getShouldUseDarkColors()));
  });

  ipcRenderer.on('should-pause-notifications-changed', (e, val) => {
    store.dispatch(updatePauseNotificationsInfo(val));
  });

  ipcRenderer.on('is-fullscreen-updated', (e, val) => {
    store.dispatch(updateIsFullScreen(val));
  });

  ipcRenderer.on('set-is-maximized', (e, isMaximized) => {
    store.dispatch(updateIsMaximized(isMaximized));
  });

  ipcRenderer.on('set-locked', (e, locked) => {
    store.dispatch(updateLocked(locked));
  });

  ipcRenderer.on('update-updater', (e, updaterObj) => {
    store.dispatch(updateUpdater(updaterObj));
  });
};

export default loadListeners;
