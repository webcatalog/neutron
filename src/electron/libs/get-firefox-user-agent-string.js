/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// modified from https://github.com/minbrowser/min/blob/95020a03e569529433feeee364fe6e7416890ac3/main/UASwitcher.js (Apache license)
const getFirefoxUserAgentString = () => {
  const rootUAs = {
    mac: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:FXVERSION.0) Gecko/20100101 Firefox/FXVERSION.0',
    windows: 'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:FXVERSION.0) Gecko/20100101 Firefox/FXVERSION.0',
    linux: 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:FXVERSION.0) Gecko/20100101 Firefox/FXVERSION.0',
  };

  let rootUA;
  if (process.platform === 'win32') {
    rootUA = rootUAs.windows;
  } else if (process.platform === 'darwin') {
    rootUA = rootUAs.mac;
  } else {
    // 'aix', 'freebsd', 'linux', 'openbsd', 'sunos'
    rootUA = rootUAs.linux;
  }

  /*
  Guess at an appropriate Firefox version to use in the UA.
  We want a recent version (ideally the latest), but not a version that hasn't been released yet.
  New releases are every ~4 weeks, with some delays for holidays. So assume 4.1 weeks, and estimate
  starting from v91 on 2021-08-10
  */

  const fxVersion = 91 + Math.floor((Date.now() - 1628553600000) / (4.1 * 7 * 24 * 60 * 60 * 1000));

  return rootUA.replace(/FXVERSION/g, fxVersion);
};

module.exports = getFirefoxUserAgentString;
