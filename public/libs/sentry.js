const electron = require('electron');
const { init } = require('@sentry/electron');
const isDev = require('electron-is-dev');

const getSentryPreference = () => {
  const isRenderer = (process && process.type === 'renderer');
  if (isRenderer) {
    return electron.ipcRenderer.sendSync('get-preference', 'sentry');
  }
  // eslint-disable-next-line global-require
  return require('./preferences').getPreference('sentry');
};

if (!isDev && getSentryPreference()) {
  init({
    dsn: 'https://c243f91cf27e4fc789c66840318809ec@o433326.ingest.sentry.io/5388233',
  });
}
