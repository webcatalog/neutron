/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const {
  app,
  dialog,
  shell,
} = require('electron');
const isDefaultMailClientAsync = require('./is-default-mail-client-async');
const isWindows10 = require('./is-windows-10');

const {
  setPreference,
  getPreference,
} = require('./preferences');

const appJson = require('../constants/app-json');

const promptSetAsDefaultMailClient = () => {
  // ask to set as default mail client
  const skipAskingDefaultMailClient = getPreference('skipAskingDefaultMailClient');
  if (skipAskingDefaultMailClient) return;
  isDefaultMailClientAsync()
    .then((isDefault) => {
      if (isDefault) return;
      dialog.showMessageBox({
        type: 'info',
        message: `Do you want to set ${appJson.name} as your default email client?`,
        buttons: ['No', 'Yes'],
        cancelId: 0,
        defaultId: 0,
        checkboxLabel: 'Don\'t ask again',
      })
        .then(({ response, checkboxChecked }) => {
          if (checkboxChecked) {
            setPreference('skipAskingDefaultMailClient', checkboxChecked);
          }
          if (response === 1) {
            // open ms-settings on Windows 10
            // as Windows 10 doesn't allow changing default app programmatically
            if (isWindows10()) {
              shell.openExternal('ms-settings:defaultapps');
            } else {
              app.setAsDefaultProtocolClient('mailto');
            }
          }
        })
        .catch(console.log); // eslint-disable-line no-console
    });
};

module.exports = promptSetAsDefaultMailClient;
