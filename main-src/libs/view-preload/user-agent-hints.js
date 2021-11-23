/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const {
  webFrame,
} = require('electron');
const os = require('os');

try {
  // add navigator.userAgentData API support
  /* Gmail - required for loading standard version (otherwise redirects to basic HTML) */
  // modified from https://github.com/minbrowser/min/blob/58927524e3cc16cc4f59bca09a6c352cec1a16ac/js/preload/siteUnbreak.js (Apache)
  const chromiumMajorVersion = process.versions.chrome.split('.')[0]; // e.g. "90"

  // Follow Chrome/Edge naming
  let platformName = 'Linux';
  if (process.platform === 'darwin') platformName = 'macOS';
  else if (process.platform === 'win32') platformName = 'Windows';

  webFrame.executeJavaScript(`
  (() => {
    const brands = [
      { brand: "WebCatalog Neutron", version: "${chromiumMajorVersion}" },
      { brand: "Chromium", version: "${chromiumMajorVersion}" },
      { brand: "Not A;Brand", version: "99" },
    ];
    const simulatedUAData = {
      brands,
      mobile: false,
      platform: "${platformName}",
      getHighEntropyValues: () => Promise.resolve({
        architecture: "${process.platform}",
        brands,
        mobile: false,
        model: "",
        platform: "${platformName}",
        platformVersion: "${os.release()}",
        uaFullVersion: "${process.versions.chrome}"
      })
    };
    Object.defineProperty(navigator, 'userAgentData', {get: () => simulatedUAData });
  })();
  `);
} catch (err) {
  // eslint-disable-next-line no-console
  console.log(err);
}
