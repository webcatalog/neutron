/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import isMas from './is-mas';
import {
  requestShowRequireLicenseDialog,
  getPreference,
} from '../senders';
import getStaticGlobal from './get-static-global';
import isBundled from './is-bundled';

const checkLicense = (reason) => {
  if (isBundled()) {
    requestShowRequireLicenseDialog(reason);
    return false;
  }

  const appJson = getStaticGlobal('appJson');
  const iapPurchased = isMas() ? getPreference('iapPurchased') : false;

  if (!appJson.iapPurchased && !iapPurchased) {
    requestShowRequireLicenseDialog(reason);
    return false;
  }
  return true;
};

export default checkLicense;
