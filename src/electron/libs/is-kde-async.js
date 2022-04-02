/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// Forked from https://github.com/t1st3/is-kde (MIT License)
const { exec } = require('child_process');

const isKdeAsync = () => new Promise((resolve, reject) => {
  if (process.platform !== 'linux') {
    resolve(false);
    return;
  }

  exec('ps -e | grep -E \'^.* kded(4|5)$\'', (error, stdout) => {
    if (error) {
      if (error.killed === false && error.signal === null) {
        resolve(false);
      }

      reject(error);
    }

    if ((stdout).length > 0) {
      resolve(true);
    }

    resolve(false);
  });
});

module.exports = isKdeAsync;
