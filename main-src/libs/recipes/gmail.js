/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
window.addEventListener('load', () => {
  // Gmail badge count
  const getBadgeCount = () => {
    let count = 0;

    // Google Chat is merged with Gmail
    // handle Google Chat
    if (window.location.href.startsWith('https://mail.google.com/chat')) {
      const badgeNode = document.querySelector('span.XU');
      if (badgeNode) {
        count = parseInt(badgeNode.innerText, 10);
      }
    // Handle Gmail
    } else {
      const sidebarItemNodes = document.getElementsByClassName('J-Ke n0');
      if (sidebarItemNodes.length > 0) {
        const primaryBadgeNode = sidebarItemNodes[0].parentNode.nextSibling; // .bsU
        if (primaryBadgeNode) {
          count = parseInt(primaryBadgeNode.innerText, 10);
        }
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
