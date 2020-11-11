/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { combineReducers } from 'redux';

import {
  UPDATE_EDIT_WORKSPACE_DOWNLOADING_ICON,
  UPDATE_EDIT_WORKSPACE_FORM,
} from '../../constants/actions';

const form = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_EDIT_WORKSPACE_FORM: return { ...state, ...action.changes };
    default: return state;
  }
};

const downloadingIcon = (state = false, action) => {
  switch (action.type) {
    case UPDATE_EDIT_WORKSPACE_DOWNLOADING_ICON: return action.downloadingIcon;
    default: return state;
  }
};

export default combineReducers({ downloadingIcon, form });
