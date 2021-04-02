/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import isMas from './is-mas';
import getStaticGlobal from './get-static-global';

const getUtmSource = () => {
  if (isMas()) {
    return `${getStaticGlobal('appJson').id}_app`;
  }
  return 'juli_app';
};

export default getUtmSource;
