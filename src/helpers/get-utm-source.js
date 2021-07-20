/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import getStaticGlobal from './get-static-global';
import isWebcatalog from './is-webcatalog';

const getUtmSource = () => {
  if (!isWebcatalog()) {
    const appId = getStaticGlobal('appJson').id;
    if (appId === 'singlebox-plus') return 'singlebox_app';
    return `${appId}_app`;
  }
  return 'juli_app';
};

export default getUtmSource;
