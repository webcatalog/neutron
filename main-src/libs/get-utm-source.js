/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

const appJson = require('../constants/app-json');
const isStandalone = require('./is-standalone');
const isMas = require('./is-mas');

const getUtmSource = () => {
  if (isMas() || isStandalone()) {
    if (appJson.id === 'singlebox-plus') return 'singlebox_app';
    return `${appJson.id}_app`;
  }
  return 'juli_app';
};

module.exports = getUtmSource;
