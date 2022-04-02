/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// '14.0.0-beta.9' to '14.0.0-beta.9+wvcus'
// '14.0.0' to '14.0.0+wvcus'
const getCastlabsElectronVersion = (electronVersion: string) => `${electronVersion}+wvcus`;

export default getCastlabsElectronVersion;
