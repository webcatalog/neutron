/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

const isMas = require('./is-mas');

const appJson = require('../constants/app-json');

const getUtmSource = () => {
  if (isMas()) {
    return `${appJson.id}_app`;
  }
  return 'juli_app';
};

module.exports = getUtmSource;
