/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const { app } = require('electron');
const path = require('path');
const sendToAllWindows = require('./send-to-all-windows');
const { getPreference } = require('./preferences');

// to keep workspace variables (meta) that
// are not saved to disk
// badge count, error, etc
const workspaceMetas = {};

const getWorkspaceMeta = (id) => workspaceMetas[id] || {};

const getWorkspaceMetas = () => workspaceMetas;

const setWorkspaceMeta = (id, opts) => {
  // init
  workspaceMetas[id] = {
    ...workspaceMetas[id],
    ...opts,
  };
  sendToAllWindows('set-workspace-meta', id, getWorkspaceMeta(id));
};

const refreshBadgeCount = (browserWindow) => {
  let count = 0;

  if (getPreference('unreadCountBadge')) {
    const metas = getWorkspaceMetas();
    Object.values(metas).forEach((m) => {
      if (m && m.badgeCount && typeof m.badgeCount === 'number' && !Number.isNaN(m.badgeCount)) {
        count += m.badgeCount;
      }
    });
  }

  if (typeof count !== 'number' || Number.isNaN(count)) {
    count = 0;
  }

  app.badgeCount = count;

  if (process.platform === 'win32') {
    if (browserWindow && !browserWindow.isDestroyed()) {
      if (count > 0) {
        browserWindow.setOverlayIcon(
          process.env.NODE_ENV === 'production'
            ? path.resolve(__dirname, 'overlay-icon.png')
            : path.resolve(__dirname, '..', '..', 'public', 'overlay-icon.png'),
          `You have ${count} new messages.`,
        );
      } else {
        browserWindow.setOverlayIcon(null, '');
      }
    }
  }
};

const setWorkspaceBadgeCount = (workspaceId, badgeCount, browserWindow) => {
  setWorkspaceMeta(workspaceId, {
    badgeCount,
  });

  refreshBadgeCount(browserWindow);
};

module.exports = {
  getWorkspaceMeta,
  getWorkspaceMetas,
  setWorkspaceMeta,
  setWorkspaceBadgeCount,
  refreshBadgeCount,
};
