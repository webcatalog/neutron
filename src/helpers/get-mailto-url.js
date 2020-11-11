/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import extractHostname from './extract-hostname';

let MAILTO_URLS;

const getMailtoUrl = (url) => {
  if (!MAILTO_URLS) {
    MAILTO_URLS = window.remote.getGlobal('MAILTO_URLS');
  }

  const extractedHostname = extractHostname(url);
  if (extractedHostname in MAILTO_URLS) {
    return MAILTO_URLS[extractedHostname];
  }

  return null;
};

export default getMailtoUrl;
