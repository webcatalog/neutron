/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

const fs = require('fs-extra');
const path = require('path');
const { app, ipcMain } = require('electron');
const { captureException, addBreadcrumb } = require('@sentry/electron');

const mainWindow = require('../windows/main');
const preferencesWindow = require('../windows/preferences');
const workspacePreferencesWindow = require('../windows/workspace-preferences');

const authJsonPath = path.resolve(app.getPath('home'), '.webcatalog', 'auth.json');

const init = () => {
  // eslint-disable-next-line no-console
  console.log('Watching for', authJsonPath);

  const handleWatch = () => {
    addBreadcrumb({
      category: 'check-auth-json',
      message: 'check-auth-json',
    });

    try {
      // if we detect the file is missing
      // then recreate it
      if (!fs.existsSync(authJsonPath)) {
        const win = mainWindow.get() || preferencesWindow.get() || workspacePreferencesWindow.get();
        if (win) {
          win.send('auth-json-changed');
        }
        return;
      }

      // if somebody tampers with the file
      // we recreate it
      const authInfo = fs.readJsonSync(authJsonPath);
      const win = mainWindow.get() || preferencesWindow.get() || workspacePreferencesWindow.get();
      if (win) {
        win.send('auth-json-changed', authInfo);
      }
    } catch (err) {
      captureException(err);
      const win = mainWindow.get() || preferencesWindow.get() || workspacePreferencesWindow.get();
      if (win) {
        win.send('auth-json-changed');
      }
    }
  };

  if (!fs.existsSync(authJsonPath)) {
    fs.writeFileSync(authJsonPath, '');
  }

  fs.watch(authJsonPath, () => {
    handleWatch();
  });

  ipcMain.on('request-check-auth-json', () => {
    handleWatch();
  });
};

module.exports = {
  init,
};
