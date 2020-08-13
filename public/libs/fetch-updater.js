const { dialog } = require('electron');
const semver = require('semver');

const packageJson = require('../../package.json');
const appJson = require('../app.json');

const mainWindow = require('../windows/main');
const preferencesWindow = require('../windows/preferences');

const customizedFetch = require('./customized-fetch');
const { setPreference } = require('./preferences');

const checkForUpdates = (silent) => {
  console.log('Checking for updates...'); // eslint-disable-line no-console
  // use in-house API
  // to avoid using GitHub API as it has rate limit (60 requests per hour)
  // to avoid bugs with instead of https://github.com/atomery/juli/releases.atom
  // https://github.com/atomery/webcatalog/issues/890
  customizedFetch('https://juli.webcatalogapp.com/releases/latest.json')
    .then((res) => res.json())
    .then((data) => data.version)
    .then((latestVersion) => {
      // in silent mode, only show popup, if there's a major update
      const hasNewUpdate = silent
        ? semver.major(latestVersion) > semver.major(packageJson.version)
        : semver.gt(latestVersion, packageJson.version);

      if (hasNewUpdate) {
        // silent mode: update checker only shows pop up if the main window is visible.
        // https://github.com/atomery/webcatalog/issues/975
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
