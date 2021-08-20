/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const {
  globalShortcut,
} = require('electron');
const { captureException } = require('@sentry/electron');

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
      if (isHidden) {
        mb.showWindow();
        const translateClipboardOnShortcut = getPreference('translateClipboardOnShortcut');
        if (translateClipboardOnShortcut) {
          const text = clipboard.readText();
          if (text.length > 0) {
            mb.window.send('set-input-text', text);
            mb.window.send('go-to-home');
          }
        }
      } else {
        mb.hideWindow();
      }
    });
  } catch (err) {
    captureException(err);
  }
};

module.exports = {
  unset,
};
