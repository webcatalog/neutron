/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const { app } = require('electron');

const getDefultUserAgentString = () => app.userAgentFallback
  // Fix WhatsApp requires Google Chrome 49+ bug
  // App Name doesn't have white space in user agent. 'Google Chat' app > GoogleChat/8.1.1
  .replace(` ${app.name.replace(/ /g, '')}/${app.getVersion()}`, ` WebCatalogNeutron/${app.getVersion()}`)
  // Hide Electron from UA to improve compatibility
  // https://github.com/webcatalog/webcatalog-app/issues/182
  .replace(` Electron/${process.versions.electron}`, '');

module.exports = getDefultUserAgentString;
