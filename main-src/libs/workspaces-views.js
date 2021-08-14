/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const {
  ipcMain,
  session,
} = require('electron');

const {
  countWorkspaces,
  createWorkspace,
  getActiveWorkspace,
  getPreviousWorkspace,
  getWorkspace,
  getWorkspaces,
  removeWorkspace,
  setActiveWorkspace,
  setWorkspace,
  setWorkspacePictureAsync,
  setWorkspaces,
} = require('./workspaces');

const {
  addViewAsync,
  hibernateView,
  realignActiveView,
  removeView,
  setActiveView,
  setViewsAudioPref,
  setViewsNotificationsPref,
} = require('./views');

const {
  hasPreference,
  setPreference,
} = require('./preferences');

const mainWindow = require('../windows/main');
const workspacePreferencesWindow = require('../windows/workspace-preferences');

const sendToAllWindows = require('./send-to-all-windows');
const extractHostname = require('./extract-hostname');
const promptSetAsDefaultMailClient = require('./prompt-set-as-default-email-client');
const promptSetAsDefaultCalendarApp = require('./prompt-set-as-default-calendar-app');
const MAILTO_URLS = require('../constants/mailto-urls');
const WEBCAL_URLS = require('../constants/webcal-urls');

const appJson = require('../constants/app-json');

const hibernationTimeouts = {};

// isRecreate: whether workspace is created to replace another workspace
const createWorkspaceView = (workspaceObj = {}) => {
  const newWorkspace = createWorkspace(workspaceObj);
  setActiveWorkspace(newWorkspace.id);

  addViewAsync(mainWindow.get(), getWorkspace(newWorkspace.id))
    .then(() => {
      setActiveView(mainWindow.get(), newWorkspace.id);

      if (workspaceObj.picture) {
        setWorkspacePictureAsync(newWorkspace.id, workspaceObj.picture);
      }

      // if user add workspace for the first time
      // show sidebar
      if (!hasPreference('sidebar')) {
        setPreference('sidebar', true);
        // if sidebar is shown, then hide title bar if user hasn't overwritten the pref
        if (!hasPreference('titlebar')) {
          setPreference('titlebar', false);
        }
        ipcMain.emit('request-realign-active-workspace');
      }

      // ask to set as default mail client
      // ask to set as default calendar client
      if (extractHostname(workspaceObj.homeUrl || appJson.url) in MAILTO_URLS) {
        promptSetAsDefaultMailClient();
      } else if (extractHostname(workspaceObj.homeUrl || appJson.url) in WEBCAL_URLS) {
        promptSetAsDefaultCalendarApp();
      }
    });
};

const setWorkspaceView = (id, opts) => {
  setWorkspace(id, opts);
  setViewsAudioPref();
  setViewsNotificationsPref();
};

const setWorkspaceViews = (workspaces) => {
  setWorkspaces(workspaces);
  setViewsAudioPref();
  setViewsNotificationsPref();
};

const wakeUpWorkspaceView = (id) => {
  addViewAsync(mainWindow.get(), getWorkspace(id))
    .then(() => {
      setWorkspace(id, {
        hibernated: false,
      });
    });
};

const hibernateWorkspaceView = (id, timeout = 0) => {
  clearTimeout(hibernationTimeouts[id]);
  // eslint-disable-next-line no-console
  console.log('Hibernating', id, 'in', timeout, 'ms');
  hibernationTimeouts[id] = setTimeout(() => {
    if (!getWorkspace(id).active) {
      hibernateView(id);
      setWorkspace(id, {
        hibernated: true,
      });
      ipcMain.emit('request-refresh-badge-count');
    }
  }, timeout);
};

const setActiveWorkspaceView = (id) => {
  const oldActiveWorkspace = getActiveWorkspace();

  clearTimeout(hibernationTimeouts[id]);
  setActiveWorkspace(id);
  setActiveView(mainWindow.get(), id);

  // hibernate old view
  if (global.hibernateWhenUnused && oldActiveWorkspace.id !== id) {
    hibernateWorkspaceView(oldActiveWorkspace.id, global.hibernateWhenUnusedTimeout);
  }
};

const realignActiveWorkspaceView = () => {
  const activeWorkspace = getActiveWorkspace();
  const win = mainWindow.get();
  if (activeWorkspace && win) {
    realignActiveView(win, activeWorkspace.id);
  }
};

const removeWorkspaceView = (id) => {
  // if there's only one workspace left, clear all
  if (countWorkspaces() === 1) {
    const win = mainWindow.get();
    if (win) {
      win.setBrowserView(null);
      win.refreshTitle('');
      sendToAllWindows('update-title', '');
    }
  } else if (countWorkspaces() > 1 && getWorkspace(id).active) {
    setActiveWorkspaceView(getPreviousWorkspace(id).id);
  }

  clearTimeout(hibernationTimeouts[id]);
  workspacePreferencesWindow.close(id);
  removeView(id);
  removeWorkspace(id);
};

const clearBrowsingData = () => {
  const workspaces = getWorkspaces();
  Object.keys(workspaces).forEach((id) => {
    session.fromPartition(`persist:${id}`).clearStorageData();
  });

  // shared session
  session.fromPartition('persist:shared').clearStorageData();
};

const loadURL = (url, id, openInNewWindow) => {
  if (id) {
    setActiveWorkspace(id);
    setActiveView(mainWindow.get(), id);
  }

  const v = mainWindow.get().getBrowserView();
  if (v) {
    if (openInNewWindow) {
      v.openInNewWindow(url);
    } else {
      v.webContents.focus();
      v.webContents.loadURL(url);
    }
  }
};

module.exports = {
  clearBrowsingData,
  createWorkspaceView,
  hibernateWorkspaceView,
  loadURL,
  realignActiveWorkspaceView,
  removeWorkspaceView,
  setActiveWorkspaceView,
  setWorkspaceView,
  setWorkspaceViews,
  wakeUpWorkspaceView,
};
