/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// cached it to improve performance
// https://github.com/electron/electron/issues/1258
let val;
const isMacOs11 = () => {
  if (!val) val = window.remote.getGlobal('isMacOs11');
  return val;
};

export default isMacOs11;
