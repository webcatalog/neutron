import { setPreference } from '../state/preferences/actions';
import { setSystemPreference } from '../state/system-preferences/actions';
import { setWorkspace, setWorkspaces } from '../state/workspaces/actions';
import { setWorkspaceMeta, setWorkspaceMetas } from '../state/workspace-metas/actions';
import {
  updateAddressBarInfo,
  updateCanGoBack,
  updateCanGoForward,
  updateIsFullScreen,
  updateShouldUseDarkColors,
  updateTitle,
} from '../state/general/actions';
import {
  closeFindInPage,
  openFindInPage,
  updateFindInPageMatches,
} from '../state/find-in-page/actions';
import {
  updatePauseNotificationsInfo,
} from '../state/notifications/actions';

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

  window.ipcRenderer.on('log', (e, message) => {
    // eslint-disable-next-line
    if (message) console.log(message);
  });

  window.ipcRenderer.on('set-preference', (e, name, value) => {
    store.dispatch(setPreference(name, value));
  });

  window.ipcRenderer.on('set-system-preference', (e, name, value) => {
    store.dispatch(setSystemPreference(name, value));
  });

  window.ipcRenderer.on('set-workspace', (e, id, value) => {
    store.dispatch(setWorkspace(id, value));
  });

  window.ipcRenderer.on('set-workspaces', (e, newWorkspaces) => {
    store.dispatch(setWorkspaces(newWorkspaces));
  });

  window.ipcRenderer.on('set-workspace-meta', (e, id, value) => {
    store.dispatch(setWorkspaceMeta(id, value));
  });

  window.ipcRenderer.on('set-workspace-metas', (e, newWorkspaceMetas) => {
    store.dispatch(setWorkspaceMetas(newWorkspaceMetas));
  });

  window.ipcRenderer.on('update-can-go-back', (e, value) => {
    store.dispatch(updateCanGoBack(value));
  });

  window.ipcRenderer.on('update-can-go-forward', (e, value) => {
    store.dispatch(updateCanGoForward(value));
  });

  window.ipcRenderer.on('update-address', (e, address, edited) => {
    store.dispatch(updateAddressBarInfo(address, edited));
  });

  window.ipcRenderer.on('update-title', (e, title) => {
    store.dispatch(updateTitle(title));
  });

  // Find In Page
  window.ipcRenderer.on('open-find-in-page', () => {
    store.dispatch(openFindInPage());
  });

  window.ipcRenderer.on('close-find-in-page', () => {
    store.dispatch(closeFindInPage());
  });

  window.ipcRenderer.on('update-find-in-page-matches', (e, activeMatch, matches) => {
    store.dispatch(updateFindInPageMatches(activeMatch, matches));
  });

  // send back a request with text
  window.ipcRenderer.on('request-back-find-in-page', (e, forward) => {
    const { open, text } = store.getState().findInPage;
    if (!open) return;
    requestFindInPage(text, forward);
  });

  window.ipcRenderer.on('native-theme-updated', () => {
    store.dispatch(updateShouldUseDarkColors(getShouldUseDarkColors()));
  });

  window.ipcRenderer.on('should-pause-notifications-changed', (e, val) => {
    store.dispatch(updatePauseNotificationsInfo(val));
  });

  window.ipcRenderer.on('is-fullscreen-updated', (e, val) => {
    store.dispatch(updateIsFullScreen(val));
  });
};

export default loadListeners;
