/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const {
  v1: uuidv1,
} = require('uuid');

const sendToAllWindows = require('./send-to-all-windows');

// keep tabs data separately
const workspaceTabs = {};

const getWorkspaceTab = (workspaceId, tabId) => {
  if (workspaceTabs[workspaceId] && workspaceTabs[workspaceId][tabId]) {
    return workspaceTabs[workspaceId][tabId];
  }
  return {};
};

const getWorkspaceTabs = () => workspaceTabs;

const setWorkspaceTab = (workspaceId, tabId, opts) => {
  if (!workspaceTabs[workspaceId]) {
    workspaceTabs[workspaceId] = {};
  }
  workspaceTabs[workspaceId][tabId] = {
    ...workspaceTabs[workspaceId],
    ...opts,
  };
  sendToAllWindows('set-workspace-tab', workspaceId, tabId, getWorkspaceTab(workspaceId));
};

const removeWorkspaceTab = (workspaceId, tabId) => {
  if (workspaceTabs[workspaceId]) {
    delete workspaceTabs[workspaceId][tabId];
  }
  sendToAllWindows('set-workspace-tab', workspaceId, tabId, null);
};

const addWorkspaceTab = (workspaceId, tabObj = {}) => {
  const newId = uuidv1();

  // find largest order
  const tabLst = Object.values(workspaceTabs[workspaceId] || {});
  let max = 0;
  for (let i = 0; i < tabLst.length; i += 1) {
    if (tabLst[i].order > max) {
      max = tabLst[i].order;
    }
  }

  const newTab = {
    ...tabObj,
    order: max + 1,
  };

  setWorkspaceTab(workspaceId, newId, tabObj);
  return newTab;
};

module.exports = {
  addWorkspaceTab,
  getWorkspaceTab,
  getWorkspaceTabs,
  setWorkspaceTab,
  removeWorkspaceTab,
};
