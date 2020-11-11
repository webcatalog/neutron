/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const {
  ipcRenderer,
  remote,
} = require('electron');
const contextMenu = require('electron-context-menu');
const isDev = require('electron-is-dev');
const machineId = require('node-machine-id');

// Activate the Sentry Electron SDK as early as possible in every process.
if (!isDev && ipcRenderer.sendSync('get-preference', 'sentry')) {
  // eslint-disable-next-line global-require
  require('../libs/sentry');
}

contextMenu({
  window: remote.getCurrentWindow(),
});

window.remote = remote;
window.ipcRenderer = ipcRenderer;
window.optOutTelemetry = !ipcRenderer.sendSync('get-preference', 'telemetry');
window.machineId = machineId.machineIdSync();
