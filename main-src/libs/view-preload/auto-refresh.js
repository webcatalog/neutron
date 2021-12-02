/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const { ipcRenderer } = require('electron');

const load = async (workspaceId) => {
  const preferences = ipcRenderer.sendSync('get-preferences');
  const workspacePreferences = ipcRenderer.sendSync('get-workspace-preferences', workspaceId);

  const autoRefresh = workspacePreferences.autoRefresh || preferences.autoRefresh;
  const autoRefreshInterval = workspacePreferences.autoRefresh
    ? (workspacePreferences.autoRefreshInterval || preferences.autoRefreshInterval)
    : preferences.autoRefreshInterval;
  const autoRefreshOnlyWhenInactive = workspacePreferences.autoRefreshOnlyWhenInactive
    || preferences.autoRefreshOnlyWhenInactive;

  if (autoRefresh) {
    setTimeout(async () => {
      const isFocused = await ipcRenderer.invoke('get-web-contents-is-focused');
      if (autoRefreshOnlyWhenInactive && isFocused) {
        return;
      }

      window.location.reload();
    }, autoRefreshInterval);
  }
};

module.exports = { load };
