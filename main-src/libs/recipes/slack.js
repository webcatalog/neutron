/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
window.addEventListener('load', () => {
  // Slack badge count
  const getBadgeCount = () => {
    const count = document.querySelectorAll('.p-channel_sidebar__channel--unread:not(.p-channel_sidebar__channel--muted) .p-channel_sidebar__badge, .p-channel_sidebar__link--unread').length;

    window.webcatalog.setBadgeCount(count);
  };

  getBadgeCount();
  setInterval(() => {
    getBadgeCount();
  }, 1000);
});
