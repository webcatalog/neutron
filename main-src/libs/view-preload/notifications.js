/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// integrate with notification scheduling feature

const {
  ipcRenderer,
  webFrame,
} = require('electron');

const load = (workspaceId) => {
  const initialShouldPauseNotifications = ipcRenderer.sendSync('get-pause-notifications-info') != null;
  webFrame.executeJavaScript(`
(function() {
  // Customize Notification behavior
  // https://stackoverflow.com/questions/53390156/how-to-override-javascript-web-api-notification-object
  const oldNotification = window.Notification;
  let shouldPauseNotifications = ${initialShouldPauseNotifications};
  window.addEventListener('message', function(e) {
    if (!e.data || e.data.type !== 'should-pause-notifications-changed') return;
    shouldPauseNotifications = e.data.val;
  });
  window.Notification = function() {
    if (!shouldPauseNotifications) {
      const notif = new oldNotification(...arguments);
      notif.addEventListener('click', () => {
        window.postMessage({ type: 'focus-workspace', workspaceId: "${workspaceId}" });
      });
      return notif;
    }
    return null;
  }
  window.Notification.requestPermission = oldNotification.requestPermission;
  Object.defineProperty(Notification, 'permission', {
    get() {
      return oldNotification.permission;
    }
  });
})();
`);

  // Communicate with the frame
  // Have to use this weird trick because contextIsolation: true
  ipcRenderer.on('should-pause-notifications-changed', (e, val) => {
    window.postMessage({ type: 'should-pause-notifications-changed', val });
  });
};

module.exports = { load };
