/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const appJson = require('../constants/app-json');
const isSnap = require('./is-snap');

const isStandalone = () => Boolean(
  appJson.standalone || process.env.REACT_APP_FORCE_STANDALONE || isSnap(),
);

module.exports = isStandalone;
