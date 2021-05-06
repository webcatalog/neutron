/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const {
  ipcRenderer,
  remote,
} = require('electron');
const machineId = require('node-machine-id');

// Activate the Sentry Electron SDK as early as possible in every process.
const isDev = process.env.NODE_ENV !== 'production';
if (!isDev && ipcRenderer.sendSync('get-preference', 'sentry')) {
  // eslint-disable-next-line global-require
  require('../libs/sentry');
}

window.remote = remote;
window.ipcRenderer = ipcRenderer;
window.machineId = machineId.machineIdSync();
