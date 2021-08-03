/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const mainWindow = require('../windows/main');

const getViewBounds = (contentSize, findInPage = false, height, width) => {
  const showSidebar = global.sidebar;
  const sidebarSize = global.sidebarSize || 'compact';
  const isFullScreen = mainWindow.get() && mainWindow.get().isFullScreen();
  const showTitleBar = process.platform === 'darwin' ? (global.titleBar && !isFullScreen) : !isFullScreen;
  const showNavigationBar = (process.platform === 'linux'
    && global.attachToMenubar
    && !global.sidebar) || global.navigationBar;

  const sidebarWidth = sidebarSize === 'expanded' ? 256 : 68;
  let titlebarHeight = 0;
  if (process.platform === 'darwin') {
    // Big Sur increases title bar height: https://github.com/microsoft/vscode/pull/110592 (28px)
    titlebarHeight = global.isMacOs11 ? 28 : 22;
  } else if (!global.useSystemTitleBar) {
    titlebarHeight = 32;
  }
  const offsetTitlebar = showTitleBar ? titlebarHeight : 0;
  const x = showSidebar ? sidebarWidth : 0;
  const y = showNavigationBar ? 36 + offsetTitlebar : 0 + offsetTitlebar;

  if (global.locked) {
    return {
      x: 0,
      y: 0,
      height: 0,
      width: 0,
    };
  }

  if (findInPage) {
    const FIND_IN_PAGE_HEIGHT = 42;
    return {
      x,
      y: y + FIND_IN_PAGE_HEIGHT,
      height: height != null ? height : contentSize[1] - y - FIND_IN_PAGE_HEIGHT,
      width: width != null ? width : contentSize[0] - x,
    };
  }

  return {
    x,
    y,
    height: height != null ? height : contentSize[1] - y,
    width: width != null ? width : contentSize[0] - x,
  };
};

module.exports = getViewBounds;
