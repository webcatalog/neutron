/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

window.addEventListener('load', () => {
  // Linear badge count
  const getBadgeCount = () => {
    let count = 0;

    const spanTags = document.getElementsByTagName('span');
    const inboxTag = [...spanTags].find((tag) => tag.innerText === 'Inbox');
    if (inboxTag) {
      const inboxBadge = inboxTag.nextSibling;
      if (inboxBadge) {
        const badgeCount = inboxBadge.innerText;
        if (badgeCount) count = Number(badgeCount);
      }
    }

    window.webcatalog.setBadgeCount(count);
  };

  getBadgeCount();
  setInterval(getBadgeCount, 1000);
});
