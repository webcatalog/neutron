/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const path = require('path');
const fs = require('fs-extra');

const getChromiumUserDataPath = require('./get-chromium-user-data-path');

const getExtensionSources = () => {
  const browserNames = {
    brave: 'Brave',
    chrome: 'Google Chrome',
    chromium: 'Chromium',
    edge: 'Microsoft Edge',
    vivaldi: 'Vivaldi',
  };

  const sources = [];

  Object.keys(browserNames).forEach((browserId) => {
    const userDataPath = getChromiumUserDataPath(browserId);
    if (userDataPath && !fs.existsSync(userDataPath)) return;
    const files = fs.readdirSync(userDataPath, { withFileTypes: true });
    const profiles = [];
    files
      .filter((f) => f.isDirectory() && f.name !== 'System Profile' && fs.existsSync(path.join(userDataPath, f.name, 'Preferences')))
      .forEach((p) => {
        const profilePath = path.join(userDataPath, p.name);
        const profileInfo = fs.readJSONSync(path.join(userDataPath, p.name, 'Preferences'));
        const profile = {
          name: profileInfo.profile.name,
          profileDirName: p.name,
          profilePath,
        };
        if (profile.name !== 'Guest') { // exclude Guest profile
          profiles.push(profile);
        }
      });

    profiles.sort((a, b) => a.name.localeCompare(b.name));

    if (profiles.length > 0) {
      sources.push({
        browserId,
        browserName: browserNames[browserId],
        profiles,
      });
    }
  });

  return sources;
};

module.exports = getExtensionSources;
