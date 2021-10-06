/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { SET_WORKSPACE_TAB, SET_WORKSPACE_TABS } from '../../constants/actions';

const workspaceTabs = (state = {}, action) => {
  switch (action.type) {
    case SET_WORKSPACE_TABS: {
      return action.workspaceTabs;
    }
    case SET_WORKSPACE_TAB: {
      const newState = { ...state };

      const { workspaceId, tabId, value } = action;

      if (value) {
        newState[workspaceId] = {
          ...newState[workspaceId],
          [tabId]: {
            ...(newState[workspaceId] ? newState[workspaceId][tabId] : {}),
            ...action.value,
          },
        };
      } else {
        newState[workspaceId] = { ...newState[workspaceId] };
        delete newState[workspaceId][tabId];
      }

      return newState;
    }
    default:
      return state;
  }
};

export default workspaceTabs;
