/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const { dialog } = require('electron');
const semver = require('semver');
const fetch = require('node-fetch').default;

const packageJson = require('../../package.json');
const appJson = require('../constants/app-json');

const mainWindow = require('../windows/main');
const preferencesWindow = require('../windows/preferences');

const { setPreference } = require('./preferences');
const isMas = require('./is-mas');
const isSnap = require('./is-snap');
const isAppx = require('./is-appx');

const checkForUpdates = (silent) => {
  if (isMas() || isSnap() || isAppx()) {
    return;
  }

  console.log('Checking for updates...'); // eslint-disable-line no-console
  // use in-house API
  // to avoid using GitHub API as it has rate limit (60 requests per hour)
  // to avoid bugs with instead of https://github.com/webcatalog/neutron/releases.atom
  // https://github.com/webcatalog/webcatalog-app/issues/890
  fetch('https://webcatalog.app/juli/releases/latest.json')
    .then((res) => res.json())
    .then((data) => data.version)
    .then((latestVersion) => {
      // in silent mode, only show popup, if there's a major update
      const hasNewUpdate = silent
        ? semver.major(latestVersion) > semver.major(packageJson.version)
        : semver.gt(latestVersion, packageJson.version);

      if (hasNewUpdate) {
        // silent mode: update checker only shows pop up if the main window is visible.
        // https://github.com/webcatalog/webcatalog-app/issues/975
        const shouldShowDialog = !silent || (mainWindow.get() && mainWindow.get().isVisible());
        if (shouldShowDialog) {
          dialog.showMessageBox(mainWindow.get(), {
            type: 'info',
            message: `An update (${appJson.name} ${latestVersion}) is available. Open WebCatalog to update this app.`,
            buttons: ['OK'],
            cancelId: 0,
            defaultId: 0,
          }).catch(console.log); // eslint-disable-line
          const now = Date.now();

          // save last time new update dialog is shown
          // so we can check later and avoid running updater too frequently
          setPreference('lastShowNewUpdateDialog', now);
        }
      } else if (!silent) {
        dialog.showMessageBox(preferencesWindow.get() || mainWindow.get(), {
          type: 'info',
          message: `${appJson.name} is up-to-date.`,
          buttons: ['OK'],
          cancelId: 0,
          defaultId: 0,
        }).catch(console.log); // eslint-disable-line
      }
    })
    .catch(() => {
      if (!silent) {
        dialog.showMessageBox(preferencesWindow.get() || mainWindow.get(), {
          type: 'error',
          message: 'Failed to check for updates. Please check your Internet connection.',
          buttons: ['OK'],
          cancelId: 0,
          defaultId: 0,
        }).catch(console.log); // eslint-disable-line
      }
    });
};

module.exports = {
  checkForUpdates,
};
