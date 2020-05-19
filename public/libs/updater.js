const { dialog } = require('electron');
const semver = require('semver');

const packageJson = require('../../package.json');
const mainWindow = require('../windows/main');
const appJson = require('../app.json');

const customizedFetch = require('./customized-fetch');

// GitHub API has rate limit & node-fetch doesn't support caching out-of-the-box
// Use caching and conditional request to ensure it's under limit
// See https://developer.github.com/v3/#conditional-requests
// Most responses return an ETag header.
// Many responses also return a Last-Modified header.
// You can use the values of these headers to make subsequent
// requests to those resources using the If-None-Match
// and If-Modified-Since headers, respectively.
// If the resource has not changed, the server will return a 304 Not Modified.
let cachedResponse = null;
const checkForUpdates = (silent) => {
  console.log('Checking for updates...'); // eslint-disable-line no-console
  const opts = {};
  if (cachedResponse) {
    opts.headers = {
      'If-None-Match': cachedResponse.etag,
    };
  }
  customizedFetch('https://api.github.com/repos/atomery/juli/releases/latest', opts)
    .then((res) => {
      if (res.status === 304) {
        return cachedResponse.json;
      }

      return res.json()
        .then((json) => {
          cachedResponse = {
            etag: res.headers.get('etag'),
            json,
          };
          return cachedResponse.json;
        });
    })
    .then((release) => release.tag_name.substring(1))
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
