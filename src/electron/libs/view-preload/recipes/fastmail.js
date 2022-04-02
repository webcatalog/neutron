/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
window.addEventListener('load', () => {
  // https://github.com/getferdi/ferdi/blob/c5af7f0d0ca6fb2e111389bc3a997721090939c2/src/webview/badge.ts#L7
  const safeParseInt = (text) => {
    if (text === undefined || text === null) {
      return 0;
    }

    // Parse number to integer
    // This will correct errors that recipes may introduce, e.g.
    // by sending a String instead of an integer
    const parsedNumber = Number.parseInt(text.toString(), 10);
    const adjustedNumber = Number.isNaN(parsedNumber) ? 0 : parsedNumber;
    return Math.max(adjustedNumber, 0);
  };

  const getBadgeCount = () => {
    // https://github.com/getferdi/recipes/blob/master/recipes/fastmail/webview.js (MIT license)
    const inbox = document.querySelector('.v-MailboxSource--inbox .v-MailboxSource-badge');
    if (!inbox) {
      window.webcatalog.setBadgeCount(0);
      return;
    }

    const messages = safeParseInt(inbox.textContent);
    window.webcatalog.setBadgeCount(messages);
  };

  getBadgeCount();
  setInterval(() => {
    getBadgeCount();
  }, 1000);
});
