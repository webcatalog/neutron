/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const { app, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs-extra');
const settings = require('electron-settings');
const {
  v1: uuidv1,
  v5: uuidv5,
} = require('uuid');
const Jimp = process.env.NODE_ENV === 'production' ? require('jimp').default : require('jimp');
const isUrl = require('is-url');
const tmp = require('tmp');

const sendToAllWindows = require('./send-to-all-windows');
const downloadAsync = require('./download-async');
const { removeWorkspaceMeta } = require('./workspace-metas');
const getPicturePath = require('./get-picture-path');

const appJson = require('../constants/app-json');

const ACCOUNT_PICTURE_PATH_UUID_NAMESPACE = '777ebe80-28ec-11eb-b7fe-6be41598616a';

const v = '43';

let workspaces;

const initWorkspaces = () => {
  if (workspaces) return;

  const loadedWorkspaces = settings.getSync(`workspaces.${v}`) || {};
  // remove corrupted data caused by v11.4.0
  if ('add' in loadedWorkspaces) {
    delete loadedWorkspaces.add;
  }

  // legacy (v=14 was used for Singlebox prior to merging with Juli)
  // Singlebox v1-v3
  if (appJson.id === 'singlebox') {
    const legacySingleboxV = '14';
    const legacyWorkspaces = settings.getSync(`workspaces.${legacySingleboxV}`);
    if (legacyWorkspaces) {
      Object.assign(loadedWorkspaces, legacyWorkspaces);
      settings.setSync(`workspaces.${v}`, loadedWorkspaces);
      settings.unset(`workspaces.${legacySingleboxV}`);
    }
  }

  if (appJson.url && Object.keys(loadedWorkspaces).length < 1) {
    const initialWorkspaceId = uuidv1();
    loadedWorkspaces[initialWorkspaceId] = {
      id: initialWorkspaceId,
      name: '',
      order: 0,
      active: true,
      // tabsData: [],
    };
    settings.setSync(`workspaces.${v}`, loadedWorkspaces);
  }

  // keep workspace objects in memory
  workspaces = loadedWorkspaces;
};

const countWorkspaces = () => {
  initWorkspaces();
  return Object.keys(workspaces).length;
};

const getWorkspaces = () => {
  initWorkspaces();
  return workspaces;
};

const getWorkspacesAsList = () => {
  const workspaceLst = Object.values(getWorkspaces())
    .sort((a, b) => a.order - b.order);

  return workspaceLst;
};

const getWorkspace = (id) => {
  initWorkspaces();
  return workspaces[id];
};

const getWorkspacePreferences = (id) => {
  const { preferences } = getWorkspace(id) || {};
  return preferences || {};
};

const getWorkspacePreference = (id, preferenceName) => {
  const preferences = getWorkspacePreferences(id);
  return preferences[preferenceName];
};

const getPreviousWorkspace = (id) => {
  const workspaceLst = getWorkspacesAsList();

  let currentWorkspaceI = 0;
  for (let i = 0; i < workspaceLst.length; i += 1) {
    if (workspaceLst[i].id === id) {
      currentWorkspaceI = i;
      break;
    }
  }

  if (currentWorkspaceI === 0) {
    return workspaceLst[workspaceLst.length - 1];
  }
  return workspaceLst[currentWorkspaceI - 1];
};

const getNextWorkspace = (id) => {
  const workspaceLst = getWorkspacesAsList();

  let currentWorkspaceI = 0;
  for (let i = 0; i < workspaceLst.length; i += 1) {
    if (workspaceLst[i].id === id) {
      currentWorkspaceI = i;
      break;
    }
  }

  if (currentWorkspaceI === workspaceLst.length - 1) {
    return workspaceLst[0];
  }
  return workspaceLst[currentWorkspaceI + 1];
};

const createWorkspace = (workspaceObj = {}) => {
  const newId = uuidv1();

  // find largest order
  const workspaceLst = getWorkspacesAsList();
  let max = 0;
  for (let i = 0; i < workspaceLst.length; i += 1) {
    if (workspaceLst[i].order > max) {
      max = workspaceLst[i].order;
    }
  }

  const newWorkspace = {
    active: false,
    hibernated: false,
    id: newId,
    name: workspaceObj.name || '',
    order: max + 1,
    ...workspaceObj,
  };
  delete newWorkspace.picture;

  workspaces[newId] = newWorkspace;

  sendToAllWindows('set-workspace', newId, newWorkspace);
  settings.setSync(`workspaces.${v}.${newId}`, newWorkspace);

  return newWorkspace;
};

const getActiveWorkspace = () => {
  if (!workspaces) return null;
  return Object.values(workspaces).find((workspace) => workspace.active);
};

const setActiveWorkspace = (id) => {
  // deactive the current one
  let currentActiveWorkspace = getActiveWorkspace();
  if (currentActiveWorkspace) {
    if (currentActiveWorkspace.id === id) return;
    currentActiveWorkspace = { ...currentActiveWorkspace };
    currentActiveWorkspace.active = false;
    workspaces[currentActiveWorkspace.id] = currentActiveWorkspace;
    sendToAllWindows('set-workspace', currentActiveWorkspace.id, currentActiveWorkspace);
    settings.setSync(`workspaces.${v}.${currentActiveWorkspace.id}`, currentActiveWorkspace);
  }

  // active new one
  const newActiveWorkspace = { ...workspaces[id] };
  newActiveWorkspace.active = true;
  newActiveWorkspace.hibernated = false;
  workspaces[id] = newActiveWorkspace;
  sendToAllWindows('set-workspace', id, newActiveWorkspace);
  settings.setSync(`workspaces.${v}.${id}`, newActiveWorkspace);
};

const setWorkspace = (id, opts) => {
  const unchangedWorkspace = workspaces[id];

  const workspace = { ...unchangedWorkspace, ...opts };
  workspaces[id] = workspace;

  ipcMain.emit('request-refresh-badge-count');
  sendToAllWindows('set-workspace', id, workspace);
  settings.setSync(`workspaces.${v}.${id}`, workspace);
};

const setWorkspaces = (newWorkspaces) => {
  workspaces = newWorkspaces;
  sendToAllWindows('set-workspaces', newWorkspaces);
  settings.setSync(`workspaces.${v}`, newWorkspaces);
};

const setWorkspacePictureAsync = (id, sourcePicturePath) => {
  const pictureId = uuidv1();

  const destPicturePath = getPicturePath(pictureId);

  return Promise.resolve()
    .then(() => {
      if (isUrl(sourcePicturePath)) {
        const tmpObj = tmp.dirSync();
        const tmpPath = tmpObj.name;
        return downloadAsync(sourcePicturePath, path.join(tmpPath, 'e.png')).then(() => path.join(tmpPath, 'e.png'));
      }

      return sourcePicturePath;
    })
    .then((downloadedPicturePath) => Jimp.read(downloadedPicturePath))
    .then((img) => new Promise((resolve) => {
      img.clone()
        .resize(128, 128)
        .quality(100)
        .write(destPicturePath, resolve);
    }))
    .then(() => {
      const currentPicturePath = getPicturePath(getWorkspace(id).pictureId);
      setWorkspace(id, {
        pictureId,
      });
      if (currentPicturePath) {
        // eslint-disable-next-line no-console
        fs.remove(currentPicturePath).catch(console.log);
      }
      return pictureId;
    });
};

const removeWorkspacePicture = (id) => {
  const workspace = getWorkspace(id);
  if (workspace.pictureId) {
    return fs.remove(getPicturePath(workspace.pictureId))
      .then(() => {
        setWorkspace(id, {
          pictureId: null,
        });
      });
  }
  return Promise.resolve();
};

const setWorkspaceAccountInfo = (id, accountInfo) => {
  const workspace = getWorkspace(id);
  if (!workspace) return Promise.resolve();
  const currentAccountInfo = workspace.accountInfo || {};
  if (currentAccountInfo.pictureUrl === accountInfo.pictureUrl
    && currentAccountInfo.name === accountInfo.name
    && currentAccountInfo.email === accountInfo.email) {
    // nothing changes
    return Promise.resolve();
  }

  const newAccountInfo = { ...accountInfo };
  return Promise.resolve()
    .then(() => {
      const pictureId = uuidv5(accountInfo.pictureUrl, ACCOUNT_PICTURE_PATH_UUID_NAMESPACE);
      if (currentAccountInfo.pictureUrl !== accountInfo.pictureUrl && accountInfo.pictureUrl) {
        const accountPicturePath = getPicturePath(pictureId, 'account-pictures');
        return downloadAsync(accountInfo.pictureUrl, accountPicturePath)
          .then(() => {
            newAccountInfo.pictureId = pictureId;
          });
      }
      return null;
    })
    .then(() => {
      setWorkspace(id, {
        accountInfo: newAccountInfo,
      });
    })
    // eslint-disable-next-line no-console
    .catch(console.log);
};

const removeWorkspaceAccountInfo = (id) => {
  const workspace = getWorkspace(id);
  return Promise.resolve()
    .then(() => {
      setWorkspace(id, {
        accountInfo: null,
      });
      if (workspace.accountInfo && workspace.accountInfo.pictureId) {
        const accountPicturePath = getPicturePath(workspace.accountInfo.pictureId, 'account-pictures');
        return fs.remove(accountPicturePath);
      }
      return null;
    });
};

const removeWorkspace = (id) => {
  const workspace = workspaces[id];

  delete workspaces[id];
  sendToAllWindows('set-workspace', id, null);
  settings.unsetSync(`workspaces.${v}.${id}`);

  removeWorkspaceMeta(id);

  // remove workspace data from disk
  fs.remove(path.join(app.getPath('userData'), 'Partitions', id))
    .then(() => {
      const p = [];
      if (workspace && workspace.pictureId) {
        p.push(fs.remove(getPicturePath(workspace.pictureId)));
      }
      if (workspace && workspace.accountInfo && workspace.accountInfo.pictureId) {
        p.push(fs.remove(getPicturePath(workspace.accountInfo.pictureId, 'account-pictures')));
      }
      return Promise.all(p);
    })
    .then(() => {
      // eslint-disable-next-line no-console
      console.log('Removed workspace data:', id);
    })
    .catch((err) => {
      // ignore the error as it doesn't affect the experience
      // eslint-disable-next-line no-console
      console.log(err);
    });
};

module.exports = {
  countWorkspaces,
  createWorkspace,
  getActiveWorkspace,
  getNextWorkspace,
  getPreviousWorkspace,
  getWorkspace,
  getWorkspacePreference,
  getWorkspacePreferences,
  getWorkspaces,
  getWorkspacesAsList,
  removeWorkspace,
  removeWorkspaceAccountInfo,
  removeWorkspacePicture,
  setActiveWorkspace,
  setWorkspace,
  setWorkspaceAccountInfo,
  setWorkspacePictureAsync,
  setWorkspaces,
};
