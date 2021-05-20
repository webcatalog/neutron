/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const { app } = require('electron');

const setWindowTitle = (browserWindow, browserViewTitle) => {
  let { badgeCount } = global;
  console.log(global);
  if (typeof badgeCount !== 'number' || Number.isNaN(badgeCount)) {
    badgeCount = 0;
  }

  let prefixTitle = app.name;
  if (badgeCount > 0) {
    prefixTitle = `${app.name} (${badgeCount})`;
  }

  if (browserViewTitle) {
    browserWindow.setTitle(`${prefixTitle} - ${browserViewTitle}`);
  } else {
    browserWindow.setTitle(prefixTitle);
  }
  console.log(browserWindow.getTitle());
};

module.exports = setWindowTitle;
