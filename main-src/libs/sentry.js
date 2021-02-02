/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const electron = require('electron');
const { init } = require('@sentry/electron');

const isRenderer = (process && process.type === 'renderer');

init({
  dsn: 'https://c243f91cf27e4fc789c66840318809ec@o433326.ingest.sentry.io/5388233',
  release: isRenderer ? electron.remote.app.getVersion() : electron.app.getVersion(),
});
