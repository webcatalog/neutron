/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const { captureException } = require('@sentry/electron/main');

let keytar;

// on Linux
// keytar requires Secret Service API (GNOME Keyring, KSecretsService and KeePassXC)
// but not all distros have the library, preventing the app from loading
try {
  // eslint-disable-next-line global-require
  keytar = require('keytar');
} catch (err) {
  // eslint-disable-next-line no-console
  console.log(err);
  captureException(err);
}

module.exports = keytar;
