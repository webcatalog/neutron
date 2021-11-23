/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
window.addEventListener('load', () => {
  // Gmail badge count
  const getBadgeCount = () => {
    let count = 0;

    const elements = document.querySelectorAll('.navItemBadge');
    elements.forEach((el) => {
      const elText = el.innerText;
      const elCount = parseInt(elText, 10);
      if (typeof elCount === 'number' && !Number.isNaN(elCount)) {
        count += elCount;
      }
    });

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
