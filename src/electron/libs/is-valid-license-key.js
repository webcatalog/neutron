/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const md5 = require('blueimp-md5');

const appJson = require('../constants/app-json');

const isValidLicenseKey = (licenseKey) => {
  try {
    if (!licenseKey) return false;

    const inputLicenseKey = licenseKey.trim().replace(/\s/g, '');

    const parts = inputLicenseKey.split('-');
    const quantity = parts[0];
    const time = parts[1];
    const md5Str = parts.slice(2).join('').toUpperCase();

    // allow user to activate Singlebox Plus with legacy Singlebox license
    if (appJson.id === 'singlebox'
      && md5(process.env.REACT_APP_LICENSE_SECRET_LEGACY + quantity + time).toUpperCase()
        === md5Str) {
      return true;
    }

    return md5(process.env.REACT_APP_LICENSE_SECRET + quantity + time).toUpperCase()
      === md5Str;
  } catch (err) {
    return false;
  }
};

module.exports = isValidLicenseKey;