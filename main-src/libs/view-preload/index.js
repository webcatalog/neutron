/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const {
  ipcRenderer,
  webFrame,
} = require('electron');

const isMas = require('../is-mas');
const { get: getRecipe } = require('./recipes');
const { load: loadDarkReader } = require('./dark-reader');

const preferences = ipcRenderer.sendSync('get-preferences');

require('./webcatalog-api');

let handled = false;
const handleLoaded = async (event) => {
  if (handled) return;

  const workspaceId = await ipcRenderer.invoke('get-web-contents-workspace-id');

  // eslint-disable-next-line no-console
  console.log(`Preload script is loading on ${event}...`);

  loadDarkReader(workspaceId);
  ipcRenderer.on('reload-dark-reader', () => {
    loadDarkReader(workspaceId);
  });

  const workspacePreferences = ipcRenderer.sendSync('get-workspace-preferences', workspaceId);

  const jsCodeInjection = workspacePreferences.jsCodeInjection || preferences.jsCodeInjection;
  const allowNodeInJsCodeInjection = workspacePreferences.jsCodeInjection
    ? Boolean(workspacePreferences.allowNodeInJsCodeInjection)
    : preferences.allowNodeInJsCodeInjection;
  const cssCodeInjection = workspacePreferences.cssCodeInjection || preferences.cssCodeInjection;
  const autoRefresh = workspacePreferences.autoRefresh || preferences.autoRefresh;
  const autoRefreshInterval = workspacePreferences.autoRefresh
    ? (workspacePreferences.autoRefreshInterval || preferences.autoRefreshInterval)
    : preferences.autoRefreshInterval;
  const autoRefreshOnlyWhenInactive = workspacePreferences.autoRefreshOnlyWhenInactive
    || preferences.autoRefreshOnlyWhenInactive;

  if (autoRefresh) {
    setTimeout(async () => {
      const isFocused = await ipcRenderer.invoke('get-web-contents-is-focused');
      if (autoRefreshOnlyWhenInactive && isFocused) {
        return;
      }

      window.location.reload();
    }, autoRefreshInterval);
  }

  if (jsCodeInjection && jsCodeInjection.trim().length > 0) {
    if (allowNodeInJsCodeInjection) {
      try {
        // eslint-disable-next-line no-new-func
        Function(
          'require',
          `"use strict";${jsCodeInjection}`,
        )(require);
      } catch (err) {
        /* eslint-disable no-console */
        console.log(err);
        /* eslint-enable no-console */
      }
    } else {
      try {
        const node = document.createElement('script');
        node.innerHTML = jsCodeInjection;
        document.body.appendChild(node);
      } catch (err) {
        /* eslint-disable no-console */
        console.log(err);
        /* eslint-enable no-console */
      }
    }
  }

  if (cssCodeInjection && cssCodeInjection.trim().length > 0) {
    try {
      const node = document.createElement('style');
      node.innerHTML = cssCodeInjection;
      document.body.appendChild(node);
    } catch (err) {
      /* eslint-disable no-console */
      console.log(err);
      /* eslint-enable no-console */
    }
  }

  try {
    const recipe = getRecipe(window.location.href);
    if (recipe) {
      // eslint-disable-next-line no-console
      console.log('loaded recipe', recipe.id);
      webFrame.executeJavaScript(recipe.code);
    }
  } catch (err) {
    /* eslint-disable no-console */
    console.log(err);
    /* eslint-enable no-console */
  }

  // hide FastMail to comply with MAS guidelines
  if (isMas() && window.location.hostname.includes('fastmail.com')) {
    try {
      const node = document.createElement('style');
      node.innerHTML = 'a[href="/pricing/"] { display: none !important; }';
      document.body.appendChild(node);
    } catch (err) {
      /* eslint-disable no-console */
      console.log(err);
      /* eslint-enable no-console */
    }
  }

  // Link preview
  const linkPreview = document.createElement('div');
  linkPreview.style.cssText = 'max-width: 80vw;height: 22px;position: fixed;bottom: -1px;right: -1px;z-index: 1000000;background-color: rgb(245, 245, 245);border-radius: 2px;border: #9E9E9E  1px solid;font-size: 12.5px;color: rgb(0, 0, 0);padding: 0px 8px;line-height: 22px;font-family: -apple-system, system-ui, BlinkMacSystemFont, sans-serif;white-space: nowrap;text-overflow: ellipsis;overflow: hidden; pointer-events:none;';
  ipcRenderer.on('update-target-url', (e, url) => {
    if (url && document.body) {
      linkPreview.innerText = url;
      document.body.appendChild(linkPreview);
    } else if (document.body && document.body.contains(linkPreview)) {
      document.body.removeChild(linkPreview);
    }
  });

  // tie Google account info with workspace
  Promise.resolve()
    .then(() => {
      // only continue if users don't share cookies between workspaces (multi-account mode)
      if (preferences.shareWorkspaceBrowsingData
        || (document.location && document.location.href && document.location.href.startsWith('https://accounts.google.com'))) {
        // eslint-disable-next-line no-console
        console.log('Skip retrieving Google account for workspace');
        return;
      }

      if (window.location.hostname.includes('google.com')) {
        let success = false;
        const getAccountInfoAsync = () => Promise.resolve()
          .then(() => {
            if (success) return;
            // eslint-disable-next-line no-console
            console.log('Getting Google account info...');
            const pictureUrl = document.querySelector('img[title="Profile"')
              .getAttribute('data-srcset')
              .split(',')
              .pop()
              .trim()
              .split(' ')[0];
            const name = document.querySelector('.gb_lb.gb_mb').innerText;
            const email = document.querySelector('.gb_nb').innerText;
            ipcRenderer.send('request-set-workspace-account-info', workspaceId, {
              pictureUrl,
              name,
              email,
            });
            // eslint-disable-next-line no-console
            console.log('Google account info retrieved.', {
              pictureUrl,
              name,
              email,
            });
            success = true;
          })
          // eslint-disable-next-line no-console
          .catch(console.log);
        // run once immediately
        getAccountInfoAsync();
        // run again after 30 seconds, 1 minute, every 5 minutes
        // as the script fails if the page is not fully loaded
        setTimeout(() => {
          getAccountInfoAsync();
        }, 30 * 1000);
        setTimeout(() => {
          getAccountInfoAsync();
        }, 60 * 1000);
        setInterval(() => {
          getAccountInfoAsync();
        }, 5 * 60 * 1000);
      }
    })
    .catch((err) => {
      console(err);
    });

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

  ipcRenderer.on('display-media-id-received', (e, val) => {
    window.postMessage({ type: 'return-display-media-id', val });
  });

  window.addEventListener('message', (e) => {
    if (!e.data) return;

    if (e.data.type === 'get-display-media-id') {
      ipcRenderer.send('request-show-display-media-window');
    }

    // set workspace to active when its notification is clicked
    if (e.data.type === 'focus-workspace') {
      ipcRenderer.send('request-show-main-window');
      ipcRenderer.send('request-set-active-workspace', e.data.workspaceId);
    }
  });

  // Printing
  ipcRenderer.on('request-print', () => {
    window.print();
  });

  // eslint-disable-next-line no-console
  console.log('Preload script is loaded...');

  handled = true;
};

// try to load as soon as dom is loaded
document.addEventListener('DOMContentLoaded', () => handleLoaded('document.on("DOMContentLoaded")'));
// if user navigates between the same website
// DOMContentLoaded might not be triggered so double check with 'onload'
// https://github.com/webcatalog/webcatalog-app/issues/797
window.addEventListener('load', () => handleLoaded('window.on("onload")'));

// Fix Can't show file list of Google Drive
// https://github.com/electron/electron/issues/16587
// Fix chrome.runtime.sendMessage is undefined for FastMail
// https://github.com/quanglam2807/singlebox/issues/21
webFrame.executeJavaScript(`
(function() {
  window.chrome = {
    runtime: {
      sendMessage: () => {},
      connect: () => {
        return {
          onMessage: {
            addListener: () => {},
            removeListener: () => {},
          },
          postMessage: () => {},
          disconnect: () => {},
        }
      }
    }
  }

  window.desktop = undefined;

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

  window.navigator.setAppBadge = (contents) => {
    webcatalog.setBadgeCount(contents);
    return Promise.resolve();
  };

  window.PushManager = undefined;
})();
`);

// enable pinch zooming (default behavior of Chromium)
// https://github.com/electron/electron/pull/12679
webFrame.setVisualZoomLevelLimits(1, 10);

require('./password-fill');
require('./user-agent-hints');
