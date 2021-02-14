/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

const isWindowsStore = () => Boolean(
  process.windowsStore || process.env.REACT_APP_FORCE_WINDOWS_STORE,
);

module.exports = isWindowsStore;
