/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const path = require('path');
const fs = require('fs-extra');

const getChromiumUserDataPath = require('./get-chromium-user-data-path');

const cached = {};

const getExtensionsFromProfile = (browserId, profileDirName) => {
  if (cached[`${browserId}:${profileDirName}`]) return cached[`${browserId}:${profileDirName}`];

  const extensionsPath = path.join(getChromiumUserDataPath(browserId), profileDirName, 'Extensions');
  if (!fs.existsSync(extensionsPath)) return [];

  const extensions = [];

  try {
    const items = fs.readdirSync(extensionsPath, { withFileTypes: true });
    items
      .forEach((item) => {
        if (!item.isDirectory()) return;

        const extensionPath = path.join(extensionsPath, item.name);

        const versionDirs = fs.readdirSync(extensionPath, { withFileTypes: true });

        versionDirs.forEach((versionDir) => {
          if (!versionDir.isDirectory()) return;

          const versionPath = path.join(extensionsPath, item.name, versionDir.name);
          if (!fs.existsSync(versionPath)) return;

          const manifestJsonPath = path.join(versionPath, 'manifest.json');

          if (!fs.existsSync(manifestJsonPath)) return;

          const manifest = fs.readJsonSync(manifestJsonPath);

          // console.log(manifest);

          // manifest version 3 is not supported
          if (manifest.manifest_version >= 3) return;

          let { name } = manifest;
          if (name.startsWith('__MSG_')) {
            try {
              const defaultLocale = manifest.default_locale || 'en';
              const messageJsonPath = path.join(versionPath, '_locales', defaultLocale, 'messages.json');
              const messages = fs.readJsonSync(messageJsonPath);
              const nameMessageId = name.match(new RegExp('__MSG_(.*)__'))[1];
              if (nameMessageId && messages[nameMessageId] && messages[nameMessageId].message) {
                name = messages[nameMessageId].message;
              } else { // messages keys are not case-sensitive
                const matchedMessageId = Object.keys(messages)
                  .find((messageId) => messageId.toLowerCase() === nameMessageId.toLowerCase());
                if (messages[matchedMessageId] && messages[matchedMessageId].message) {
                  name = messages[matchedMessageId].message;
                }
              }
            } catch (err) {
              // eslint-disable-next-line no-console
              console.log(err);
            }
          }

          const iconRelativePath = manifest.icons ? (manifest.icons[128]
            || manifest.icons[64] || manifest.icons[48] || manifest.icons[16]) : null;

          extensions.push({
            id: item.name,
            name,
            path: versionPath,
            version: manifest.version,
            icon: iconRelativePath ? path.join(versionPath, iconRelativePath) : null,
          });
        });
      });

    extensions.sort((a, b) => a.name.localeCompare(b.name));

    cached[`${browserId}:${profileDirName}`] = extensions;
    return extensions;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return [];
  }
};

module.exports = getExtensionsFromProfile;
