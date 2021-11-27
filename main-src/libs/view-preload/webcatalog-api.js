/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const {
  contextBridge,
  ipcRenderer,
} = require('electron');

contextBridge.exposeInMainWorld(
  'webcatalog',
  {
    setBadgeCount: (count = 0) => {
      if (typeof count !== 'number') {
        // eslint-disable-next-line no-console
        console.log('webcatalog.setBadgeCount() only accepts number as input');
        return;
      }
      ipcRenderer.invoke('set-web-contents-badge', count);
    },
    clearSiteData: () => ipcRenderer.invoked('flush-web-contents-app-data'),
    isPopup: () => ipcRenderer.sendSync('is-popup'),
  },
);

require('./password-fill');
require('./user-agent-hints');