const { app } = require('electron');
const path = require('path');
const fs = require('fs-extra');
const settings = require('electron-settings');
const { v1: uuidv1 } = require('uuid');
const Jimp = require('jimp');
const isUrl = require('is-url');
const tmp = require('tmp');

const sendToAllWindows = require('./send-to-all-windows');
const downloadAsync = require('./download-async');

const appJson = require('../app.json');

const v = '43';

let workspaces;

const initWorkspaces = () => {
  if (workspaces) return;

  const defaultWorkspaces = {};
  const loadedWorkspaces = settings.get(`workspaces.${v}`, defaultWorkspaces);

  // legacy (v=14 was used for Singlebox prior to merging with Juli)
  // Singlebox v1-v3
  if (appJson.id === 'singlebox') {
    const legacySingleboxV = '14';
    const legacyWorkspaces = settings.get(`workspaces.${legacySingleboxV}`, null);
    if (legacyWorkspaces) {
      Object.assign(loadedWorkspaces, legacyWorkspaces);
      settings.set(`workspaces.${v}`, loadedWorkspaces);
      settings.delete(`workspaces.${legacySingleboxV}`);
    }
  }

  if (Object.keys(loadedWorkspaces).length < 1 && appJson.url) {
    const initialWorkspaceId = uuidv1();
    defaultWorkspaces[initialWorkspaceId] = {
      id: initialWorkspaceId,
      name: '',
      order: 0,
      active: true,
    };
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

const createWorkspace = (name, homeUrl, transparentBackground) => {
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
    homeUrl,
    id: newId,
    name: name || '',
    order: max + 1,
    transparentBackground,
  };

  workspaces[newId] = newWorkspace;

  sendToAllWindows('set-workspace', newId, newWorkspace);
  settings.set(`workspaces.${v}.${newId}`, newWorkspace);

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
    settings.set(`workspaces.${v}.${currentActiveWorkspace.id}`, currentActiveWorkspace);
  }

  // active new one
  const newActiveWorkspace = { ...workspaces[id] };
  newActiveWorkspace.active = true;
  newActiveWorkspace.hibernated = false;
  workspaces[id] = newActiveWorkspace;
  sendToAllWindows('set-workspace', id, newActiveWorkspace);
  settings.set(`workspaces.${v}.${id}`, newActiveWorkspace);
};

const setWorkspace = (id, opts) => {
  const workspace = { ...workspaces[id], ...opts };
  workspaces[id] = workspace;
  sendToAllWindows('set-workspace', id, workspace);
  settings.set(`workspaces.${v}.${id}`, workspace);
};

const setWorkspaces = (newWorkspaces) => {
  workspaces = newWorkspaces;
  sendToAllWindows('set-workspaces', newWorkspaces);
  settings.set(`workspaces.${v}`, newWorkspaces);
};

const setWorkspacePicture = (id, sourcePicturePath) => {
  const workspace = getWorkspace(id);
  const pictureId = uuidv1();

  if (workspace.picturePath === sourcePicturePath) {
    return;
  }

  const destPicturePath = path.join(app.getPath('userData'), 'pictures', `${pictureId}.png`);

  Promise.resolve()
    .then(() => {
      if (isUrl(sourcePicturePath)) {
        const tmpObj = tmp.dirSync();
        const tmpPath = tmpObj.name;
        return downloadAsync(sourcePicturePath, path.join(tmpPath, 'e.png')).then(() => path.join(tmpPath, 'e.png'));
      }

      return sourcePicturePath;
    })
    .then((picturePath) => Jimp.read(picturePath))
    .then((img) => new Promise((resolve) => {
      img.clone()
        .resize(128, 128)
        .quality(100)
        .write(destPicturePath, resolve);
    }))
    .then(() => {
      const currentPicturePath = getWorkspace(id).picturePath;
      setWorkspace(id, {
        pictureId,
        picturePath: destPicturePath,
      });
      if (currentPicturePath) {
        return fs.remove(currentPicturePath);
      }
      return null;
    });
};

const removeWorkspacePicture = (id) => {
  const workspace = getWorkspace(id);
  if (workspace.picturePath) {
    return fs.remove(workspace.picturePath)
      .then(() => {
        setWorkspace(id, {
          pictureId: null,
          picturePath: null,
        });
      });
  }
  return Promise.resolve();
};

// tasks to clean up leftover workspace data
const cleanLeftoversAsync = () => Promise.resolve()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Cleaning workspace leftovers...');
    // remove unused partitions
    const partitionsDirPath = path.join(app.getPath('userData'), 'Partitions');
    if (!fs.existsSync(partitionsDirPath)) {
      return null;
    }

    const p = fs.readdirSync(
      partitionsDirPath,
      { withFileTypes: true },
    )
      .filter((d) => d.isDirectory() && getWorkspace(d.name) == null)
      .map((d) => fs.remove(path.join(partitionsDirPath, d.name)));

    return Promise.all(p);
  })
  .then(() => {
    // remove unused pictures
    const picturesDirPath = path.join(app.getPath('userData'), 'pictures');
    if (!fs.existsSync(picturesDirPath)) {
      return null;
    }

    const p = fs.readdirSync(
      picturesDirPath,
      { withFileTypes: true },
    )
      .filter((f) => {
        if (!f.isFile() || !f.name.endsWith('.png')) return false;

        const pictureId = path.parse(f.name).name;
        const isInUse = Object.values(getWorkspaces())
          .some((workspace) => workspace.pictureId === pictureId);

        return !isInUse;
      })
      .map((f) => fs.remove(path.join(picturesDirPath, f.name)));

    return Promise.all(p);
  })
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Done cleaning workspace leftovers.');
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.log(err);
  });

const removeWorkspace = (id) => {
  delete workspaces[id];
  sendToAllWindows('set-workspace', id, null);
  settings.delete(`workspaces.${v}.${id}`);
  setTimeout(() => {
    cleanLeftoversAsync();
  }, 5000);
};

module.exports = {
  countWorkspaces,
  createWorkspace,
  getActiveWorkspace,
  getNextWorkspace,
  getPreviousWorkspace,
  getWorkspace,
  getWorkspaces,
  getWorkspacesAsList,
  removeWorkspace,
  setActiveWorkspace,
  setWorkspace,
  setWorkspaces,
  setWorkspacePicture,
  removeWorkspacePicture,
};
