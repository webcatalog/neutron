/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

const rawWebcalUrls = [
  {
    hostnames: ['calendar.google.com'],
    mailtoUrl: 'https://calendar.google.com/r?cid=%s',
  },
];

const WEBCAL_URLS = {};
rawWebcalUrls.forEach((item) => {
  item.hostnames.forEach((hostname) => {
    WEBCAL_URLS[hostname] = item.mailtoUrl;
  });
});

module.exports = WEBCAL_URLS;
