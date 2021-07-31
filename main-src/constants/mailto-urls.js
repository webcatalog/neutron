/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

const rawMailtoUrls = [
  {
    hostnames: ['fastmail.com'],
    mailtoUrl: 'http://www.fastmail.fm/action/compose/?mailto=%s',
  },
  {
    hostnames: ['gmail.com', 'mail.google.com', 'googlemail.com'],
    mailtoUrl: 'https://mail.google.com/mail/?extsrc=mailto&url=%s',
  },
  {
    hostnames: ['outlook.live.com', 'outlook.com', 'hotmail.com'],
    mailtoUrl: 'https://outlook.live.com/owa/?path=/mail/action/compose&to=%s',
  },
  {
    hostnames: ['outlook.office.com'],
    mailtoUrl: 'https://outlook.office.com/mail/deeplink/compose?to=%s',
  },
  {
    hostnames: ['mail.yahoo.com', 'yahoomail.com'],
    mailtoUrl: 'https://compose.mail.yahoo.com/?To=%s',
  },
  {
    hostnames: ['mail.zoho.com'],
    mailtoUrl: 'https://mail.zoho.com/zm/comp.do?ct=%s',
  },
  {
    hostnames: ['tutanota.com', 'mail.tutanota.com'],
    mailtoUrl: 'https://mail.tutanota.com/mailto#url=%s',
  },
  {
    hostnames: ['hey.com', 'app.hey.com'],
    mailtoUrl: 'https://app.hey.com/mailto/%s',
  },
  {
    hostnames: ['soverin.net', 'mail.soverin.net'],
    mailtoUrl: 'https://mail.soverin.net/?_task=mail&_action=compose&_to=%s',
  },
  {
    hostnames: ['mail.disroot.org'],
    // https://github.com/RainLoop/rainloop-webmail/blob/19d3b559dadc4fbd647e085263257a84f5672be5/dev/App/User.js
    mailtoUrl: 'https://mail.disroot.org/?mailto&to=%s',
  },
];

const MAILTO_URLS = {};
rawMailtoUrls.forEach((item) => {
  item.hostnames.forEach((hostname) => {
    MAILTO_URLS[hostname] = item.mailtoUrl;
  });
});

module.exports = MAILTO_URLS;
