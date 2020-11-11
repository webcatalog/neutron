/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { SET_WORKSPACE_META, SET_WORKSPACE_METAS } from '../../constants/actions';

const workspaceMetas = (state = {}, action) => {
  switch (action.type) {
    case SET_WORKSPACE_METAS: {
      return action.workspaceMetas;
    }
    case SET_WORKSPACE_META: {
      const newState = { ...state };

      if (action.value) newState[action.id] = { ...newState[action.id], ...action.value };
      else delete newState[action.id];

      return newState;
    }
    default:
      return state;
  }
};

export default workspaceMetas;
