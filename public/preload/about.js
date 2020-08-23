window.mode = 'about';

require('./shared');

const path = require('path');

window.iconPath = path.join(__dirname, '..', 'icon.png')
  .replace('app.asar', 'app.asar.unpacked');
