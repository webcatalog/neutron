/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const { ipcRenderer } = require('electron');

const load = async (workspaceId) => {
  const preferences = ipcRenderer.sendSync('get-preferences');
  const workspacePreferences = ipcRenderer.sendSync('get-workspace-preferences', workspaceId);

  const jsCodeInjection = workspacePreferences.jsCodeInjection || preferences.jsCodeInjection;
  const allowNodeInJsCodeInjection = workspacePreferences.jsCodeInjection
    ? Boolean(workspacePreferences.allowNodeInJsCodeInjection)
    : preferences.allowNodeInJsCodeInjection;
  const cssCodeInjection = workspacePreferences.cssCodeInjection || preferences.cssCodeInjection;

  if (jsCodeInjection && jsCodeInjection.trim().length > 0) {
    if (allowNodeInJsCodeInjection) {
      try {
        // eslint-disable-next-line no-new-func
        Function(
          'require',
          `"use strict";${jsCodeInjection}`,
        )(require);
      } catch (err) {
        /* eslint-disable no-console */
        console.log(err);
        /* eslint-enable no-console */
      }
    } else {
      try {
        const node = document.createElement('script');
        node.innerHTML = jsCodeInjection;
        document.body.appendChild(node);
      } catch (err) {
        /* eslint-disable no-console */
        console.log(err);
        /* eslint-enable no-console */
      }
    }
  }

  if (cssCodeInjection && cssCodeInjection.trim().length > 0) {
    try {
      const node = document.createElement('style');
      node.innerHTML = cssCodeInjection;
      document.body.appendChild(node);
    } catch (err) {
      /* eslint-disable no-console */
      console.log(err);
      /* eslint-enable no-console */
    }
  }
};

module.exports = { load };
