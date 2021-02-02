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
  setWorkspacePicture,
  setWorkspaces,
} = require('./workspaces');

const {
  addView,
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

const sendToAllWindows = require('./send-to-all-windows');
const extractHostname = require('./extract-hostname');
const promptSetAsDefaultMailClient = require('./prompt-set-as-default-email-client');
const MAILTO_URLS = require('../constants/mailto-urls');

const appJson = require('../constants/app-json');

// isRecreate: whether workspace is created to replace another workspace
const createWorkspaceView = (workspaceObj = {}) => {
  const newWorkspace = createWorkspace(workspaceObj);
  setActiveWorkspace(newWorkspace.id);

  addView(mainWindow.get(), getWorkspace(newWorkspace.id));
  setActiveView(mainWindow.get(), newWorkspace.id);

  if (workspaceObj.picture) {
    setWorkspacePicture(newWorkspace.id, workspaceObj.picture);
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
  if (extractHostname(workspaceObj.homeUrl || appJson.url) in MAILTO_URLS) {
    promptSetAsDefaultMailClient();
  }
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
  addView(mainWindow.get(), getWorkspace(id));
  setWorkspace(id, {
    hibernated: false,
  });
};

const hibernateWorkspaceView = (id) => {
  if (!getWorkspace(id).active) {
    hibernateView(id);
    setWorkspace(id, {
      hibernated: true,
    });
  }
};

const setActiveWorkspaceView = (id) => {
  const oldActiveWorkspace = getActiveWorkspace();

  setActiveWorkspace(id);
  setActiveView(mainWindow.get(), id);

  // hibernate old view
  if (oldActiveWorkspace.hibernateWhenUnused && oldActiveWorkspace.id !== id) {
    hibernateWorkspaceView(oldActiveWorkspace.id);
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
      win.setTitle(appJson.name);
      sendToAllWindows('update-title', '');
    }
  } else if (countWorkspaces() > 1 && getWorkspace(id).active) {
    setActiveWorkspaceView(getPreviousWorkspace(id).id);
  }

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

const loadURL = (url, id) => {
  if (id) {
    setActiveWorkspace(id);
    setActiveView(mainWindow.get(), id);
  }

  const v = mainWindow.get().getBrowserView();
  if (v) {
    v.webContents.focus();
    v.webContents.loadURL(url);
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
