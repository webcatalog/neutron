/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const { app } = require('electron');
const path = require('path');
const { getPreference } = require('./preferences');
const mainWindow = require('../windows/main');

const { getWorkspaceMeta, setWorkspaceMeta } = require('./workspace-metas');
const { getWorkspaces } = require('./workspaces');

const refreshBadgeCount = () => {
  const browserWindow = mainWindow.get();
  let count = 0;

  if (getPreference('unreadCountBadge')) {
    const workspaces = getWorkspaces();
    Object.keys(workspaces).forEach((id) => {
      const workspace = workspaces[id];

      if (workspace.hibernated) return;
      if (workspace.preferences && workspace.preferences.unreadCountBadge === false) return;

      const m = getWorkspaceMeta(id);
      if (!m) return;
      if (m && m.badgeCount && typeof m.badgeCount === 'number' && !Number.isNaN(m.badgeCount)) {
        count += m.badgeCount;
      }
    });
  }

  if (typeof count !== 'number' || Number.isNaN(count)) {
    count = 0;
  }

  global.badgeCount = count;
  app.badgeCount = count;

  if (browserWindow && !browserWindow.isDestroyed()) {
    if (process.platform === 'win32') {
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

    browserWindow.refreshTitle();
  }
};

const setWorkspaceBadgeCount = (workspaceId, badgeCount) => {
  setWorkspaceMeta(workspaceId, {
    badgeCount,
  });

  refreshBadgeCount();
};

module.exports = {
  setWorkspaceBadgeCount,
  refreshBadgeCount,
};
