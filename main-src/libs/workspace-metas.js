/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const { ipcMain } = require('electron');
const sendToAllWindows = require('./send-to-all-windows');

// to keep workspace variables (meta) that
// are not saved to disk
// badge count, error, etc
const workspaceMetas = {};

const getWorkspaceMeta = (id) => workspaceMetas[id] || {};

const getWorkspaceMetas = () => workspaceMetas;

const setWorkspaceMeta = (id, opts) => {
  // init
  workspaceMetas[id] = {
    ...workspaceMetas[id],
    ...opts,
  };
  sendToAllWindows('set-workspace-meta', id, getWorkspaceMeta(id));
};

const removeWorkspaceMeta = (workspaceId) => {
  delete workspaceMetas[workspaceId];

  ipcMain.emit('request-refresh-badge-count');
};

module.exports = {
  getWorkspaceMeta,
  getWorkspaceMetas,
  setWorkspaceMeta,
  removeWorkspaceMeta,
};
