/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { getGlobal } from '@electron/remote';

// cached global values to improve performance
// most of global values are static, unchanged
// so we don't need to keep getting update from remote
// https://github.com/electron/electron/issues/1258
const cached: Record<string, any> = {};

/**
* @deprecated We will phase out using `getGlobal` to share info betweeen main & renderer processes
*/
const getStaticGlobal = (key: string) => {
  if (!cached[key]) {
    cached[key] = getGlobal(key);
  }

  return cached[key];
};

export default getStaticGlobal;
