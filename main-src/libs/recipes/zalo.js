/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
window.addEventListener('load', () => {
  const getBadgeCount = () => {
    const SELECTOR_CHANNELS_UNREAD = '.nav__tabs__top .leftbar-unread.unread-red';
    const count = document.querySelectorAll(SELECTOR_CHANNELS_UNREAD).length;

    window.webcatalog.setBadgeCount(count);
  };

  getBadgeCount();
  setInterval(() => {
    getBadgeCount();
  }, 1000);
});
