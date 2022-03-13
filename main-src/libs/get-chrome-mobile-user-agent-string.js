/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const getChromeDesktopUserAgentString = require('./get-default-user-agent-string');

const getChromeMobileUserAgentString = () => getChromeDesktopUserAgentString()
  .replace(/(Mozilla\/5.0 \().+?(\))/, 'Mozilla/5.0 (Linux; Android 10)')
  .replace('Safari/', 'Mobile Safari/');

module.exports = getChromeMobileUserAgentString;
