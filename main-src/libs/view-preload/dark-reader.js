/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const {
  ipcRenderer,
} = require('electron');
const {
  enable: enableDarkMode,
  disable: disableDarkMode,
  setFetchMethod: setFetchMethodDarkMode,
} = require('darkreader');

const fetch = require('node-fetch').default;

require('./webcatalog-api');

const loadAsync = async (workspaceId) => {
  const shouldUseDarkColor = ipcRenderer.sendSync('get-should-use-dark-colors');
  const workspaceDarkReader = ipcRenderer.sendSync('get-workspace-preference', workspaceId, 'darkReader');

  // only load built-in Dark Reader if users are not using external Dark Reader extension
  const darkReaderExtensionDetected = ipcRenderer.sendSync('get-global', 'darkReaderExtensionDetected');
  let darkReader = false;
  if (!darkReaderExtensionDetected) {
    darkReader = workspaceDarkReader != null
      ? workspaceDarkReader
      : ipcRenderer.sendSync('get-preference', 'darkReader'); // get fresh value
  }

  const isWhatsApp = window.location.hostname.includes('web.whatsapp.com');

  // disable Dark Reader in WhatsApp Web
  // Dark Reader distorts QR Code and prevents users from signing in
  // also WhatsApp Web already has dark theme
  if (shouldUseDarkColor && darkReader && !isWhatsApp) {
    let darkReaderBrightness;
    let darkReaderContrast;
    let darkReaderGrayscale;
    let darkReaderSepia;

    // if workspaceDarkReader is defined
    // use darkReader config
    if (workspaceDarkReader != null) {
      const workspacePreferences = ipcRenderer.sendSync('get-workspace-preferences', workspaceId);
      darkReaderBrightness = workspacePreferences.darkReaderBrightness || 100;
      darkReaderContrast = workspacePreferences.darkReaderContrast || 100;
      darkReaderGrayscale = workspacePreferences.darkReaderGrayscale || 0;
      darkReaderSepia = workspacePreferences.darkReaderSepia || 0;
    } else {
      const freshPreferences = ipcRenderer.sendSync('get-preferences'); // get fresh values
      darkReaderBrightness = freshPreferences.darkReaderBrightness;
      darkReaderContrast = freshPreferences.darkReaderContrast;
      darkReaderGrayscale = freshPreferences.darkReaderGrayscale;
      darkReaderSepia = freshPreferences.darkReaderSepia;
    }
    // use node-fetch
    // to avoid CORS-related issues
    // see https://github.com/webcatalog/webcatalog-app/issues/993
    setFetchMethodDarkMode((url) => fetch(url));
    enableDarkMode({
      brightness: darkReaderBrightness,
      contrast: darkReaderContrast,
      grayscale: darkReaderGrayscale,
      sepia: darkReaderSepia,
    });
  } else {
    disableDarkMode();
  }
};

module.exports = { loadAsync };
