/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
window.addEventListener('load', () => {
  const getBadgeCount = () => {
    // eslint-disable-next-line no-console
    console.log('updating badge');
    let total = 0;
    try {
      const numberBadges = [...document.querySelector('nav').querySelectorAll('[class^="numberBadge-"]')].map((el) => parseInt(el.innerText, 10));
      numberBadges.forEach((num) => {
        if (Number.isNaN(num)) return;
        total += num;
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
    window.webcatalog.setBadgeCount(total);
  };

  getBadgeCount();
  setInterval(() => {
    getBadgeCount();
  }, 1000);
});
