/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
window.addEventListener('load', () => {
  // Messenger badge count
  const getBadgeCount = () => {
    let count = 0;
    document.querySelectorAll('[data-testid="mwthreadlist-item"]').forEach((node) => {
      if (node.querySelector('.lrazzd5p')) count += 1;
    });

    window.webcatalog.setBadgeCount(count);
  };

  getBadgeCount();
  setInterval(() => {
    getBadgeCount();
  }, 1000);
});
