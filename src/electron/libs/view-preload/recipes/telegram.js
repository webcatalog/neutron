/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
window.addEventListener('load', () => {
  // derived from https://github.com/getferdi/recipes/blob/master/recipes/telegram/webview.js (MIT license)

  const telegramVersion = document
    .querySelector('meta[name="application-name"]')
    ?.getAttribute('content');

  const isWebZ = telegramVersion?.includes('WebZ');
  const isWebK = telegramVersion?.includes('WebK');

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

  // There are two different Telegram versions for internal competition
  // Read more: https://bugs.telegram.org/c/4002/public
  const webZCount = () => {
    let directCount = 0;
    let groupCount = 0;

    const directCountSelector = document.querySelectorAll(
      '.chat-list .ListItem.private .Badge.unread:not(.muted)',
    );
    const groupCountSelector = document.querySelectorAll(
      '.chat-list .ListItem.group .Badge.unread:not(.muted)',
    );

    directCountSelector.forEach((badge) => {
      directCount += safeParseInt(badge.textContent);
    });

    groupCountSelector.forEach((badge) => {
      groupCount += safeParseInt(badge.textContent);
    });

    window.webcatalog.setBadge(directCount + groupCount);
  };

  const webKCount = () => {
    let directCount = 0;
    let groupCount = 0;

    const elements = document.querySelectorAll('.rp:not(.is-muted)');

    elements.forEach((element) => {
      const subtitleBadge = element.querySelector('.dialog-subtitle-badge');

      if (subtitleBadge) {
        const parsedValue = safeParseInt(subtitleBadge.textContent);

        if (element.dataset.peerId > 0) {
          directCount += parsedValue;
        } else {
          groupCount += parsedValue;
        }
      }
    });

    window.webcatalog.setBadge(directCount + groupCount);
  };

  const getBadgeCount = () => {
    if (isWebZ) {
      webZCount();
    } else if (isWebK) {
      webKCount();
    }
  };

  getBadgeCount();
  setInterval(() => {
    getBadgeCount();
  }, 1000);
});
