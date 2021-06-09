/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { combineReducers } from 'redux';

import { SET_WORKSPACE, SET_WORKSPACES } from '../../constants/actions';

const workspaces = (state = {}, action) => {
  switch (action.type) {
    case SET_WORKSPACES: {
      return action.workspaces;
    }
    case SET_WORKSPACE: {
      const newState = { ...state };

      if (action.value) newState[action.id] = { ...newState[action.id], ...action.value };
      else delete newState[action.id];

      return newState;
    }
    default:
      return state;
  }
};

const activeWorkspaceId = (state = null, action) => {
  switch (action.type) {
    case SET_WORKSPACES: {
      return Object.values(action.workspaces)
        .find((workspace) => workspace.active).id;
    }
    case SET_WORKSPACE: {
      if (action.value) {
        if (action.value.active) {
          return action.id;
        }
      } else if (state === action.id) { // got deleted
        return null;
      }

      return state;
    }
    default:
      return state;
  }
};

export default combineReducers({
  activeWorkspaceId,
  workspaces,
});
