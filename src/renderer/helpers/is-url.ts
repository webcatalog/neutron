/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const isUrl = (str: string) => {
  try {
    new URL(str); // eslint-disable-line
    return true;
  } catch (_) {
    return false;
  }
};

export default isUrl;
