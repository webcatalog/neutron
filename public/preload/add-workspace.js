window.mode = 'add-workspace';

const { remote } = require('electron');
const contextMenu = require('electron-context-menu');

contextMenu({
  window: remote.getCurrentWindow(),
});
