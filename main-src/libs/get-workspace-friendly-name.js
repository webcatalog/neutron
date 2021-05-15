/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// in most apps, we call workspace "Account"
// in Clover, we call workspace "Service"
const appJson = require('../constants/app-json');

const getWorkspaceFriendlyName = (plural = false) => {
  if (!appJson.url && global.shareWorkspaceBrowsingData) {
    if (plural) return 'Services';
    return 'Service';
  }

  if (plural) return 'Accounts';
  return 'Account';
};

module.exports = getWorkspaceFriendlyName;
