/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

const { app } = require('electron');

const sendToAllWindows = require('./send-to-all-windows');

const getSystemPreference = (name) => {
  switch (name) {
    case 'openAtLogin': { // return yes, yes-hidden, no
      const loginItemSettings = app.getLoginItemSettings();
      const { openAtLogin, openAsHidden } = loginItemSettings;
      if (openAtLogin && openAsHidden) return 'yes-hidden';
      if (openAtLogin) return 'yes';
      return 'no';
    }
    default: {
      return null;
    }
  }
};

const getSystemPreferences = () => ({
  openAtLogin: getSystemPreference('openAtLogin'),
});

const setSystemPreference = (name, value) => {
  switch (name) {
    case 'openAtLogin': {
      app.setLoginItemSettings({
        openAtLogin: value.startsWith('yes'),
        openAsHidden: value === 'yes-hidden',
      });
      break;
    }
    default: {
      break;
    }
  }
  sendToAllWindows('set-system-preference', name, value);
};

module.exports = {
  getSystemPreference,
  getSystemPreferences,
  setSystemPreference,
};
