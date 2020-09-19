const { desktopCapturer } = require('electron');

window.desktopCapturer = desktopCapturer;

window.mode = 'display-media';

require('./shared');
