/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// integrate web API with display media selection window

const { ipcRenderer, webFrame } = require('electron');

const loadAsync = async () => {
  ipcRenderer.on('display-media-id-received', (e, val) => {
    window.postMessage({ type: 'return-display-media-id', val });
  });

  window.addEventListener('message', (e) => {
    if (!e.data) return;

    if (e.data.type === 'get-display-media-id') {
      ipcRenderer.send('request-show-display-media-window');
    }
  });

  webFrame.executeJavaScript(`
(function() {
  if (window.navigator.mediaDevices) {
    window.navigator.mediaDevices.getDisplayMedia = () => {
      return new Promise((resolve, reject) => {
        const listener = (e) => {
          if (!e.data || e.data.type !== 'return-display-media-id') return;
          if (e.data.val) { resolve(e.data.val); }
          else { reject(new Error('Rejected')); }
          window.removeEventListener('message', listener);
        };
        window.postMessage({ type: 'get-display-media-id' });
        window.addEventListener('message', listener);
      })
        .then((id) => {
          return navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
              mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: id,
              }
            }
          });
        });
    };
  }
})();
`);
};

module.exports = { loadAsync };
