/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
window.addEventListener('load', () => {
  // Gmail badge count
  const getBadgeCount = () => {
    let count = 0;

    if (document.getElementsByClassName('J-Ke n0').length > 0) {
      if (document.getElementsByClassName('J-Ke n0')[0].getAttribute('aria-label') != null) {
        count = parseInt(document.getElementsByClassName('J-Ke n0')[0].getAttribute('aria-label').replace(/[^0-9.]/g, ''), 10);
      }
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

  // overwrite gmail email discard button
  const node = document.createElement('script');
  node.innerHTML = 'window.close = () => { window.location.href = \'https://mail.google.com\' }';
  document.body.appendChild(node);
});
