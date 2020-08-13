const {
  desktopCapturer,
  ipcRenderer,
  remote,
  webFrame,
} = require('electron');
const contextMenu = require('electron-context-menu');
const isDev = require('electron-is-dev');

// Activate the Sentry Electron SDK as early as possible in every process.
if (!isDev && ipcRenderer.sendSync('get-preference', 'sentry')) {
  // eslint-disable-next-line global-require
  require('../libs/sentry');
}

contextMenu({
  window: remote.getCurrentWindow(),
});

window.remote = remote;
window.desktopCapturer = desktopCapturer;
window.ipcRenderer = ipcRenderer;

webFrame.setVisualZoomLevelLimits(1, 1);
