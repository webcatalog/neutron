/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const crypto = require('crypto');

// https://stackoverflow.com/a/51540480/5522263
const generateStrongPassword = (
  length = 30,
  wishlist = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$',
) => Array.from(crypto.randomFillSync(new Uint32Array(length)))
  .map((x) => wishlist[x % wishlist.length])
  .join('');

module.exports = generateStrongPassword;
