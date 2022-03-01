/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const {
  ipcRenderer,
  webFrame,
} = require('electron');

const autoRefresh = require('./auto-refresh');
const codeInjection = require('./code-injection');
const darkReader = require('./dark-reader');
const displayMedia = require('./display-media');
const linkPreview = require('./link-preview');
const notifications = require('./notifications');
const passwordFill = require('./password-fill');
const recipes = require('./recipes');
const userAgentHints = require('./user-agent-hints');
const webcatalogApi = require('./webcatalog-api');

let handled = false;
const handleLoaded = async (event) => {
  if (handled) return;

  // eslint-disable-next-line no-console
  console.log(`Preload script is loading on ${event}...`);

  const isGoogleLoginPage = document.location && document.location.href && document.location.href.startsWith('https://accounts.google.com');

  // don't load these modules when visiting accounts.google.com
  // to avoid Google blocking the app ("insecure")
  if (!isGoogleLoginPage) {
    linkPreview.loadAsync();

    const workspaceId = await ipcRenderer.invoke('get-web-contents-workspace-id');

    darkReader.loadAsync(workspaceId);
    ipcRenderer.on('reload-dark-reader', () => {
      darkReader.loadAsync(workspaceId);
    });

    autoRefresh.loadAsync(workspaceId);
    // these modules need webcatalog APIs
    codeInjection.loadAsync(workspaceId);
    notifications.load(workspaceId);
    recipes.loadAsync();
  }

  window.addEventListener('message', (e) => {
    if (!e.data) return;

    // set workspace to active when its notification is clicked
    if (e.data.type === 'focus-workspace') {
      ipcRenderer.send('request-show-main-window');
      ipcRenderer.send('request-set-active-workspace', e.data.workspaceId);
    }
  });

  // Printing
  ipcRenderer.on('request-print', () => {
    window.print();
  });

  // eslint-disable-next-line no-console
  console.log('Preload script is loaded...');

  handled = true;
};

// critical web APIs
// must load synchronously before loading other components
userAgentHints.load();
displayMedia.load();
webcatalogApi.load();
passwordFill.load();
// Fix Can't show file list of Google Drive
// https://github.com/electron/electron/issues/16587
webFrame.executeJavaScript(`
(function() {
  window.navigator.setAppBadge = (contents) => {
    webcatalog.setBadgeCount(contents);
    return Promise.resolve();
  };

  window.PushManager = undefined;
})();
`);

// try to load as soon as dom is loaded
document.addEventListener('DOMContentLoaded', () => handleLoaded('document.on("DOMContentLoaded")'));
// if user navigates between the same website
// DOMContentLoaded might not be triggered so double check with 'onload'
// https://github.com/webcatalog/webcatalog-app/issues/797
window.addEventListener('load', () => handleLoaded('window.on("onload")'));

// enable pinch zooming (default behavior of Chromium)
// https://github.com/electron/electron/pull/12679
webFrame.setVisualZoomLevelLimits(1, 10);
