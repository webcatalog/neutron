/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// return whether the user is using the beta/pre-release channel of the app
const { app } = require('electron');
const semver = require('semver');

const isTester = () => Boolean(semver.prerelease(app.getVersion()));

module.exports = isTester;
