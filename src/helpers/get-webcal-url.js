/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import extractHostname from './extract-hostname';
import getStaticGlobal from './get-static-global';

const getWebcalUrl = (url) => {
  const WEBCAL_URLS = getStaticGlobal('WEBCAL_URLS');

  const extractedHostname = extractHostname(url);
  if (extractedHostname in WEBCAL_URLS) {
    return WEBCAL_URLS[extractedHostname];
  }

  return null;
};

export default getWebcalUrl;
