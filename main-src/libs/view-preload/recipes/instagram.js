/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
window.addEventListener('load', () => {
  // badge count
  const getBadgeCount = () => {
    let count = 0;

    const element = document.querySelector('a[href^="/direct/inbox"]');

    if (element) {
      count = parseInt(element.innerText, 10);
    }

    if (typeof count !== 'number' || Number.isNaN(count)) {
      count = 0;
    }

    window.webcatalog.setBadgeCount(count);
  };

  getBadgeCount();
  setInterval(() => {
    getBadgeCount();
  }, 1000);
});
