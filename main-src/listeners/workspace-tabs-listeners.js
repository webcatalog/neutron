/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const { ipcMain } = require('electron');

const {
  addWorkspaceTab,
  removeWorkspaceTab,
} = require('../libs/workspace-tabs');

const load = () => {
  ipcMain.on('request-add-workspace-tab', (_, workspaceId, tabObj) => {
    addWorkspaceTab(workspaceId, tabObj);
  });

  ipcMain.on('request-remove-workspace-tab', (_, workspaceId, tabId) => {
    removeWorkspaceTab(workspaceId, tabId);
  });
};

module.exports = { load };

// const constructBrowserViewKey = (id, tabIndex) => `${id}/${tabIndex}`;

// ipcMain.on('request-new-tab-browser', (_, tabInfo) => {
//   const win = mainWindow.get();
//   const currentWorkspace = getActiveWorkspace();

//   const { tabIndex, homeUrl } = tabInfo;
//   // Workspace ID
//   const { id, tabs } = getActiveWorkspace();

//   const newBrowserViewKey = constructBrowserViewKey(id, tabIndex);
//   addViewAsync(win, currentWorkspace, newBrowserViewKey);

//   // Update workspace config
//   setWorkspace(id, {
//     tabs: {
//       ...tabs,
//       [tabIndex + 1]: { homeUrl },
//     },
//   });
// });

// ipcMain.on('request-open-tab-browser', (_, tabInfo) => {
//   const { newTabIndex, selectedTabIndex } = tabInfo;
//   const currentWorkspace = getActiveWorkspace();
//   const win = mainWindow.get();

//   // Latest Url from tab session.
//   const { id, tabs } = currentWorkspace;

//   // Construct keys for new browserView to be added and browserView to update.
//   const newBrowserViewKey = constructBrowserViewKey(id, newTabIndex);

//   // Get new browserView from current dataset.
//   const newBrowserView = getView(newBrowserViewKey);

//   // Update workspace config
//   setWorkspace(id, {
//     tabs: {
//       ...tabs,
//       [selectedTabIndex]: {
//         ...tabs[newTabIndex],
//       },
//     },
//     selectedTabIndex,
//   });

//   // Clear current browserView to prevent memory leaks.
//   win.setBrowserView(undefined);

//   if (newBrowserView) {
//     win.setBrowserView(newBrowserView);
//   } else {
//     addViewAsync(win, currentWorkspace, newBrowserViewKey);
//   }
// });

// ipcMain.on('request-close-tab-browser', (_, tabInfo) => {
//   const { tabIndex } = tabInfo;
//   const { id, tabs } = getActiveWorkspace();
//   // const isCloseTabCurrent = (selectedTabIndex === tabIndex);

//   const browserKey = constructBrowserViewKey(id, tabIndex);

//   delete tabs[tabIndex];
//   removeView(browserKey);

//   // TODO:
//   // split to 2 cases
//   // if the closed one are the current view
//   // or the closed one are another view
//   // for 2nd case should consider which tab to fall back on.

//   setWorkspace(id, { tabs });
// });
