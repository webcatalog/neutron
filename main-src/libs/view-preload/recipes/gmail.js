/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
window.addEventListener('load', () => {
  // fix "Google Chat isn't supported on your current browser"
  // https://github.com/webcatalog/webcatalog-app/issues/820
  if (window.location.href
      && window.location.href.includes('error/browser-not-supported')
      && window.location.href.startsWith('https://chat.google.com')) {
    const ref = new URL(window.location.href).searchParams.get('ref') || '';
    window.location.replace(`https://chat.google.com${ref}`);
    return;
  }

  // Gmail badge count
  const getBadgeCount = () => {
    let count = 0;

    // logic for new Gmail UI: https://workspaceupdates.googleblog.com/2022/01/new-integrated-view-for-gmail.html
    // sum of badge counts of Gmail, Chat, Spaces, Meet on the sidebar
    const newSidebarItemNodes = document.querySelectorAll('.XU.aH6');
    if (newSidebarItemNodes.length > 0) {
      newSidebarItemNodes.forEach((node) => {
        // node.innerText return empty string if primaryBadgeNode is hidden
        const parsedNum = parseInt(node.innerText || node.innerHTML, 10);
        if (typeof parsedNum === 'number' && !Number.isNaN(parsedNum)) {
          count += parsedNum;
        }
      });
    } else { // if code for new Gmail UI doesn't work, try to use older one
      const sidebarItemNodes = document.getElementsByClassName('J-Ke n0');
      if (sidebarItemNodes.length > 0) {
        const primaryBadgeNode = sidebarItemNodes[0].parentNode.nextSibling; // .bsU
        if (primaryBadgeNode) {
          // primaryBadgeNode.innerText return empty string if primaryBadgeNode is hidden
          const parsedNum = parseInt(primaryBadgeNode.innerText || primaryBadgeNode.innerHTML, 10);
          if (typeof parsedNumber === 'number' && !Number.isNaN(parsedNum)) {
            count = parsedNum;
          }
        }
      }
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
  if (window.webcatalog && !window.webcatalog.isPopup()) {
    const node = document.createElement('script');
    node.innerHTML = 'window.close = () => { window.location.href = \'https://mail.google.com\' }';
    document.body.appendChild(node);
  }

  if (window.webcatalog) {
    let accountInfoRetrieved = false;
    const getAccountInfoAsync = () => Promise.resolve()
      .then(() => {
        if (accountInfoRetrieved) return;
        // eslint-disable-next-line no-console
        console.log('Getting Google account info...');
        const pictureUrl = document.querySelector('img[title="Profile"')
          .getAttribute('data-srcset')
          .split(',')
          .pop()
          .trim()
          .split(' ')[0];
        const name = document.querySelector('.gb_lb.gb_mb').innerText;
        const email = document.querySelector('.gb_nb').innerText;
        window.webcatalog.setAccountInfo(pictureUrl, name, email);
        // eslint-disable-next-line no-console
        console.log('Google account info retrieved.', {
          pictureUrl,
          name,
          email,
        });
        accountInfoRetrieved = true;
      })
      // eslint-disable-next-line no-console
      .catch(console.log);
    // run once immediately
    getAccountInfoAsync();
    // run again after 30 seconds, 1 minute, every 5 minutes
    // as the script fails if the page is not fully loaded
    setTimeout(() => {
      getAccountInfoAsync();
    }, 30 * 1000);
    setTimeout(() => {
      getAccountInfoAsync();
    }, 60 * 1000);
    setInterval(() => {
      getAccountInfoAsync();
    }, 5 * 60 * 1000);
  }
});
