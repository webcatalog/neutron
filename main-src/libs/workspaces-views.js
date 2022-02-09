/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const {
  ipcMain,
  session,
  Tray,
  Menu,
} = require('electron');
const path = require('path');
const fs = require('fs-extra');

const { captureException } = require('@sentry/electron');

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
  removeWorkspacePictureAsync,
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
const getPicturePath = require('./get-picture-path');
const { getPreferences } = require('./preferences');

const MAILTO_URLS = require('../constants/mailto-urls');
const WEBCAL_URLS = require('../constants/webcal-urls');

const appJson = require('../constants/app-json');
const isMenubarBrowser = require('./is-menubar-browser');
const getTrayNativeImageFromPathAsync = require('./get-tray-native-image-from-path-async');

const hibernationTimeouts = {};
const trays = {};

const removeWorkspaceTray = (id) => {
  if (trays[id]) {
    trays[id].destroy();
    delete trays[id];
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
      if (isMenubarBrowser()) {
        win.hide();
      }
    }
  } else if (countWorkspaces() > 1 && getWorkspace(id).active) {
    setActiveWorkspaceView(getPreviousWorkspace(id).id);
  }

  clearTimeout(hibernationTimeouts[id]);
  workspacePreferencesWindow.close(id);
  removeWorkspaceTray(id);
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

const addWorkspaceTrayAsync = async (id) => {
  if (trays[id]) {
    removeWorkspaceTray(id);
  }
  const workspaceInfo = getWorkspace(id);
  if (!workspaceInfo) return;

  let picturePath;
  if (workspaceInfo.pictureId) {
    picturePath = getPicturePath(workspaceInfo.pictureId);
    if (!fs.existsSync(picturePath)) {
      picturePath = undefined;
    }
  }

  if (!picturePath) {
    const defaultIconFileName = 'default-workspace-image-light.png';
    picturePath = process.env.NODE_ENV === 'production'
      ? path.resolve(__dirname, defaultIconFileName)
      : path.resolve(__dirname, '..', '..', 'public', defaultIconFileName);
  }

  const img = await getTrayNativeImageFromPathAsync(picturePath, false);
  const tray = new Tray(img);
  tray.setIgnoreDoubleClickEvents(true);

  tray.on('click', (e, bounds) => {
    const currentActiveWorkspace = getActiveWorkspace();
    const win = mainWindow.get();
    if (win && win.isVisible() && currentActiveWorkspace && currentActiveWorkspace.id === id) {
      win.hide();
    } else {
      setActiveWorkspaceView(id);
      mainWindow.show(bounds);
    }
  });

  tray.on('right-click', () => {
    const trayContextMenu = Menu.buildFromTemplate([
      {
        label: 'Tab Preferences...',
        click: () => {
          ipcMain.emit('request-show-workspace-preferences-window', null, id);
        },
      },
      { type: 'separator' },
      {
        label: 'Remove',
        click: () => {
          removeWorkspaceView(id);
        },
      },
    ]);

    tray.popUpContextMenu(trayContextMenu);
  });

  trays[id] = tray;
};

// isRecreate: whether workspace is created to replace another workspace
const createWorkspaceView = (workspaceObj = {}) => {
  const newWorkspace = createWorkspace(workspaceObj);
  setActiveWorkspace(newWorkspace.id);

  addViewAsync(mainWindow.get(), getWorkspace(newWorkspace.id))
    .then(() => {
      setActiveView(mainWindow.get(), newWorkspace.id);

      // if user add workspace for the first time
      // show sidebar
      if (!isMenubarBrowser() && !hasPreference('sidebar')) {
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
    })
    .then(() => {
      if (workspaceObj.picture) {
        return setWorkspacePictureAsync(newWorkspace.id, workspaceObj.picture)
          // eslint-disable-next-line no-console
          .catch((err) => console.log(err));
      }
      return null;
    })
    .then(() => {
      if (isMenubarBrowser()) {
        addWorkspaceTrayAsync(newWorkspace.id)
          .catch((err) => {
            // eslint-disable-next-line no-console
            console.log(err);
            captureException(err);
          });
      }
    });
};

const initWorkspaceViews = () => {
  const workspaceObjects = getWorkspaces();

  const {
    hibernateUnusedWorkspacesAtLaunch,
  } = getPreferences();

  if (isMenubarBrowser()) {
    Object.keys(workspaceObjects).forEach(async (id) => {
      addWorkspaceTrayAsync(id)
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.log(err);
          captureException(err);
        });
    });
  }

  Object.keys(workspaceObjects).forEach((id) => {
    const workspace = workspaceObjects[id];
    if (
      (hibernateUnusedWorkspacesAtLaunch || (
        global.hibernateWhenUnused && global.hibernateWhenUnusedTimeout === 0
      ))
      && !workspace.active
    ) {
      if (!workspace.hibernated) {
        setWorkspace(workspace.id, { hibernated: true });
      }
      return;
    }
    setWorkspace(workspace.id, { hibernated: false });
    addViewAsync(mainWindow.get(), workspace);
  });
};

const setWorkspaceViewPictureAsync = async (id, sourcePicturePath) => {
  const pictureId = await setWorkspacePictureAsync(id, sourcePicturePath);
  addWorkspaceTrayAsync(id);
  return pictureId;
};

const removeWorkspaceViewPictureAsync = async (id) => {
  await removeWorkspacePictureAsync(id);
  addWorkspaceTrayAsync(id);
};

module.exports = {
  initWorkspaceViews,
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
  setWorkspaceViewPictureAsync,
  removeWorkspaceViewPictureAsync,
};
