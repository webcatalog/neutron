const electron = require('electron');
const { init } = require('@sentry/electron');

const isRenderer = (process && process.type === 'renderer');

init({
  dsn: 'https://c243f91cf27e4fc789c66840318809ec@o433326.ingest.sentry.io/5388233',
  release: isRenderer ? electron.remote.app.getVersion() : electron.app.getVersion(),
});
