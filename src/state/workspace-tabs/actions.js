/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { SET_WORKSPACE_TAB, SET_WORKSPACE_TABS } from '../../constants/actions';

export const setWorkspaceTab = (workspaceId, tabId, value) => ({
  type: SET_WORKSPACE_TAB,
  workspaceId,
  tabId,
  value,
});

export const setWorkspaceTabs = (workspaceTabs) => ({
  type: SET_WORKSPACE_TABS,
  workspaceTabs,
});
