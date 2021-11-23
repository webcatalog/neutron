/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const {
  ipcMain,
} = require('electron');

const appJson = require('../../constants/app-json');

const getWorkspaceFriendlyName = require('../get-workspace-friendly-name');

const {
  getWorkspaces,
  getActiveWorkspace,
  getNextWorkspace,
  getPreviousWorkspace,
} = require('../workspaces');

const {
  getView,
} = require('../views');

const getWorkspaceName = (workspace) => {
  let workspaceName = `${getWorkspaceFriendlyName()} ${workspace.order + 1}`;
  if (workspace.name) workspaceName = workspace.name;
  else if (workspace.accountInfo) {
    if (workspace.accountInfo.name && workspace.accountInfo.email) {
      workspaceName = `${workspace.accountInfo.name} (${workspace.accountInfo.email})`;
    } else if (workspace.accountInfo.name) {
      workspaceName = workspace.accountInfo.name;
    }
  }
  return workspaceName;
};

const getWorkspacesSubmenu = () => {
  const workspaces = getWorkspaces();
  const hasWorkspaces = Object.keys(workspaces).length > 0;

  const submenu = [];

  // hide list of workspaces ogether when the app is locked
  // preventing unauthorized stalking
  if (!global.locked) {
    Object.values(getWorkspaces())
      .sort((a, b) => a.order - b.order)
      .forEach((workspace, i) => {
        const label = getWorkspaceName(workspace);
        submenu.push({
          label,
          type: 'checkbox',
          checked: workspace.active,
          click: () => {
            if (workspace.active) return;
            ipcMain.emit('request-set-active-workspace', null, workspace.id);
          },
          accelerator: i < 9 ? `CmdOrCtrl+${i + 1}` : null,
        });
      });
  }

  submenu.push(
    { type: 'separator' },
    {
      label: `Select Next ${getWorkspaceFriendlyName()}`,
      click: () => {
        const currentActiveWorkspace = getActiveWorkspace();
        const nextWorkspace = getNextWorkspace(currentActiveWorkspace.id);
        ipcMain.emit('request-set-active-workspace', null, nextWorkspace.id);
      },
      accelerator: 'CmdOrCtrl+Shift+]',
      enabled: !global.locked && hasWorkspaces,
    },
    {
      label: `Select Previous ${getWorkspaceFriendlyName()}`,
      click: () => {
        const currentActiveWorkspace = getActiveWorkspace();
        const previousWorkspace = getPreviousWorkspace(currentActiveWorkspace.id);
        ipcMain.emit('request-set-active-workspace', null, previousWorkspace.id);
      },
      accelerator: 'CmdOrCtrl+Shift+[',
      enabled: !global.locked && hasWorkspaces,
    },
    { type: 'separator' },
    {
      label: `Set Current URL as ${getWorkspaceFriendlyName()}'s Home Page`,
      click: () => {
        const activeWorkspace = getActiveWorkspace();
        const v = getView(activeWorkspace.id);
        const currentUrl = v.webContents.getURL();
        ipcMain.emit('request-set-workspace', null, activeWorkspace.id, {
          homeUrl: currentUrl,
        });
      },
      enabled: !global.locked && hasWorkspaces,
    },
    { type: 'separator' },
    {
      label: `Edit Current ${getWorkspaceFriendlyName()}`,
      click: () => {
        const activeWorkspace = getActiveWorkspace();
        ipcMain.emit('request-show-workspace-preferences-window', null, activeWorkspace.id);
      },
      enabled: !global.locked && hasWorkspaces,
    },
    {
      label: `Remove Current ${getWorkspaceFriendlyName()}`,
      click: () => {
        const activeWorkspace = getActiveWorkspace();
        ipcMain.emit('request-remove-workspace', null, activeWorkspace.id);
      },
      enabled: !global.locked && hasWorkspaces,
    },
    { type: 'separator' },
    {
      label: `Add ${appJson.name} ${getWorkspaceFriendlyName()}`,
      click: () => {
        ipcMain.emit('request-create-workspace');
      },
      visible: Boolean(appJson.url),
      enabled: !global.locked,
    },
    {
      label: appJson.url ? `Add Custom ${getWorkspaceFriendlyName()}` : `Add ${getWorkspaceFriendlyName()}`,
      click: () => ipcMain.emit('request-show-add-workspace-window'),
      enabled: !global.locked,
    },
  );

  submenu.push({ type: 'separator' });

  return submenu;
};

module.exports = getWorkspacesSubmenu;
