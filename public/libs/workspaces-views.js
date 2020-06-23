const { session, ipcMain } = require('electron');

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
  setWorkspaces,
} = require('./workspaces');

const {
  addView,
  hibernateView,
  removeView,
  setActiveView,
  setViewsAudioPref,
  setViewsNotificationsPref,
} = require('./views');

const { isPreferenceUnset } = require('./preferences');

const mainWindow = require('../windows/main');

// isRecreate: whether workspace is created to replace another workspace
const createWorkspaceView = (isRecreate = false) => {
  const newWorkspace = createWorkspace();
  setActiveWorkspace(newWorkspace.id);

  addView(mainWindow.get(), getWorkspace(newWorkspace.id));
  setActiveView(mainWindow.get(), newWorkspace.id);

  // if user add workspace for the first time
  // show sidebar
  if (!isRecreate && isPreferenceUnset('sidebar')) {
    ipcMain.emit('request-set-preference', null, 'sidebar', true);
    ipcMain.emit('request-realign-active-workspace');
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

const removeWorkspaceView = (id) => {
  if (countWorkspaces() === 1) {
    createWorkspaceView(true);
  } else if (getWorkspace(id).active) {
    setActiveWorkspaceView(getPreviousWorkspace(id).id);
  }

  removeWorkspace(id);
  removeView(id);
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
  removeWorkspaceView,
  setActiveWorkspaceView,
  setWorkspaceView,
  setWorkspaceViews,
  wakeUpWorkspaceView,
};
