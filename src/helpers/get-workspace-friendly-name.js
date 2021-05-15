/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import getStaticGlobal from './get-static-global';

// in most apps, we call workspace "Account"
// if data is shared between workspaces, we call workspace "Service"
const getWorkspaceFriendlyName = (plural = false) => {
  if (!getStaticGlobal('appJson').url && getStaticGlobal('shareWorkspaceBrowsingData')) {
    if (plural) return 'Services';
    return 'Service';
  }

  if (plural) return 'Accounts';
  return 'Account';
};

export default getWorkspaceFriendlyName;
