/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

const isMas = require('./is-mas');
const isWindowsStore = require('./is-windows-store');

const isBundled = () => !isMas() && !isWindowsStore();

module.exports = isBundled;
