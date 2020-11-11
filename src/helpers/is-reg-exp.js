/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const isRegExp = (str) => {
  try {
    new RegExp(`^${str}$`, 'i'); // eslint-disable-line
    return true;
  } catch {
    return false;
  }
};

export default isRegExp;
