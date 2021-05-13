/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
window.addEventListener('load', () => {
  // Discord doesn't use document.title to show message count
  // but use favicon
  // so we get the number from the UI and update it whenever favicon changes
  const updateTitle = () => {
    // eslint-disable-next-line no-console
    console.log('updating badge');
    let total = 0;
    try {
      const numberBadges = [...document.querySelector('nav').querySelectorAll('[class^="numberBadge-"]')].map((el) => parseInt(el.innerText, 10));
      numberBadges.forEach((num) => { total += num; });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
    window.webcatalog.setBadgeCount(total);
  };

  let interval = setInterval(() => {
    if (document.querySelector('nav')) {
      // https://blog.sessionstack.com/how-javascript-works-tracking-changes-in-the-dom-using-mutationobserver-86adc7446401
      const mutationObserver = new window.MutationObserver(() => {
        updateTitle();
      });
      mutationObserver.observe(document.querySelector('link[rel=icon]'), {
        attributes: true,
      });
      updateTitle();
      clearInterval(interval);
      interval = null;
    }
  }, 1000);
});
