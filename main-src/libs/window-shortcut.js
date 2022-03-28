/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const {
  globalShortcut,
} = require('electron');
const mainWindow = require('../windows/main');

const unset = (combinator) => {
  if (combinator) {
    try {
      globalShortcut.unregister(combinator);
    } catch (err) {
      console.log(err); // eslint-disable-line no-console
    }
  }
};

const set = (combinator) => {
  if (!combinator) return;
  try {
    globalShortcut.register(combinator, () => {
      const win = mainWindow.get();
      if (win.isVisible() && !win.isMinimized()) {
        if (global.attachToMenubar) {
          win.hide();
        } else {
          win.minimize();
        }
      } else {
        mainWindow.show();
      }
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
};

module.exports = {
  set,
  unset,
};
