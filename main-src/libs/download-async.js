/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const fsExtra = require('fs-extra');
const fetch = require('node-fetch').default;

// https://github.com/node-fetch/node-fetch/issues/375#issuecomment-385751664
const downloadAsync = (
  url, dest, fetchOpts, ...fetchArgs
) => fsExtra.ensureFile(dest)
  .then(() => fetch(url, fetchOpts, ...fetchArgs))
  .then((res) => new Promise((resolve, reject) => {
    const fileStream = fsExtra.createWriteStream(dest);
    res.body.pipe(fileStream);
    res.body.on('error', (err) => {
      reject(err);
    });
    fileStream.on('finish', () => {
      resolve();
    });
  }));

module.exports = downloadAsync;
