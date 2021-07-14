/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
window.addEventListener('load', () => {
  // Gmail badge count
  const getBadgeCount = () => {
    let count = 0;

    const sidebarItemNodes = document.getElementsByClassName('J-Ke n0');
    if (sidebarItemNodes.length > 0) {
      const primaryBadgeNode = sidebarItemNodes[0].parentNode.nextSibling; // .bsU
      if (primaryBadgeNode) {
        count = parseInt(primaryBadgeNode.innerText, 10);
      }
    }

    if (typeof count !== 'number' || Number.isNaN(count)) {
      count = 0;
    }

    window.webcatalog.setBadgeCount(count);
  };

  // Google Chat is merged with Gmail
  // handle Google Chat
  // Google Chat is using https://developer.mozilla.org/en-US/docs/Web/API/Navigator/setAppBadge'
  // so no need to run these scripts
  if (!window.location.href.startsWith('https://mail.google.com/chat')) {
    getBadgeCount();
    setInterval(() => {
      getBadgeCount();
    }, 1000);
  }

  // Google will attempt to close the window when user discards or sends the email
  // but as WebCatalog allows the composer to be opened in main window
  // we overwrite this behavior to avoid Gmail closes the app window
  if (!window.webcatalog.isPopup()) {
    const node = document.createElement('script');
    node.innerHTML = 'window.close = () => { window.location.href = \'https://mail.google.com\' }';
    document.body.appendChild(node);
  }
});
