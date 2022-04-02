/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const { app } = require('electron');
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
  if (count !== app.badgeCount) {
    app.badgeCount = count;
  }

  if (browserWindow && !browserWindow.isDestroyed()) {
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
