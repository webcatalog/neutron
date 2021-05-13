/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
window.addEventListener('load', () => {
  // Fix WhatsApp requires Google Chrome 49+ bug
  // https://github.com/meetfranz/recipe-whatsapp/blob/master/webview.js
  setTimeout(() => {
    const elem = document.querySelector('.landing-title.version-title');
    if (elem && elem.innerText.toLowerCase().includes('google chrome')) {
      window.location.reload();
    }
  }, 1000);

  window.addEventListener('beforeunload', async () => {
    try {
      window.webcatalog.clearSiteData();
      const registrations = await window.navigator.serviceWorker.getRegistrations();

      registrations.forEach((r) => {
        r.unregister();
        console.log('ServiceWorker unregistered'); // eslint-disable-line no-console
      });
    } catch (err) {
      console.err(err); // eslint-disable-line no-console
    }
  });
});
