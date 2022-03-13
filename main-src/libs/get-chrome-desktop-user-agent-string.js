/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const { app } = require('electron');

const getChromeDesktopUserAgentString = () => app.userAgentFallback
  // Hide WebCatalogNeutron from UA to improve compatibility
  // (makes the UA Chrome-like)
  // https://github.com/webcatalog/webcatalog-app/issues/182
  .replace(` WebCatalogNeutron/${app.getVersion()}`, '');

module.exports = getChromeDesktopUserAgentString;
