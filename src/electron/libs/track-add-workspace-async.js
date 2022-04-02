/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const fetch = require('./customized-fetch');

const trackAddWorkspaceAsync = (deviceId, appId) => {
  const url = new URL('https://api.webcatalog.io/track-workspace');
  url.searchParams.append('deviceId', deviceId);
  url.searchParams.append('appId', appId);

  return fetch(url)
    // eslint-disable-next-line no-console
    .catch((err) => console.log(err));
};

module.exports = trackAddWorkspaceAsync;
