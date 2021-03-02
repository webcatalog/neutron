/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
// https://github.com/node-fetch/node-fetch/issues/450#issuecomment-387045223
const fetch = require('node-fetch').default;

const customizedFetch = (url, opts, ...args) => fetch(url, opts, ...args);

module.exports = customizedFetch;
