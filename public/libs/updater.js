const { dialog } = require('electron');
const semver = require('semver');
const xmlParser = require('fast-xml-parser');

const packageJson = require('../../package.json');
const mainWindow = require('../windows/main');
const appJson = require('../app.json');

const customizedFetch = require('./customized-fetch');

const checkForUpdates = (silent) => {
  console.log('Checking for updates...'); // eslint-disable-line no-console
  // avoid using GitHub API as it has rate limit (60 requests per hour)
  customizedFetch('https://github.com/atomery/juli/releases.atom')
    .then((res) => res.text())
    .then((xmlData) => {
      const releases = xmlParser.parse(xmlData).feed.entry;

      // find stable version
      for (let i = 0; i < releases.length; i += 1) {
        const release = releases[i];
        const tagName = release.id.split('/').pop();
        const version = tagName.substring(1);
        if (!semver.prerelease(version)) {
          return version;
        }
      }

      return Promise.reject(new Error('Server returns no valid updates.'));
    })
    .then((latestVersion) => {
      if (semver.gt(latestVersion, packageJson.version)) {
        dialog.showMessageBox(mainWindow.get(), {
          type: 'info',
          message: `An update (${appJson.name} ${latestVersion}) is available. Use the latest version of WebCatalog to update this app.`,
          buttons: ['OK'],
          cancelId: 0,
          defaultId: 0,
        }).catch(console.log); // eslint-disable-line
      } else if (!silent) {
        dialog.showMessageBox(mainWindow.get(), {
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
        dialog.showMessageBox(mainWindow.get(), {
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
