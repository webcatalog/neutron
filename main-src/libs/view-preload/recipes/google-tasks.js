/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// If https://tasks.google.com/embed/list/~default is not first loaded without origin param, it will return 404.
// It must be https://tasks.google.com/embed/?origin=https://calendar.google.com
window.addEventListener('load', () => {
  if (document.title && document.title.includes('Error 404 (Not Found)')) {
    const urlObject = new URL(document.location.href);
    urlObject.searchParams.append('origin', 'https://calendar.google.com');
    window.location = urlObject.toString();
  }
});
