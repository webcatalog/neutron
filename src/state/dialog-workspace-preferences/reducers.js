/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import cleanDeep from 'clean-deep';

import { combineReducers } from 'redux';

import {
  UPDATE_WORKSPACE_PREFERENCES_DIALOG,
} from '../../constants/actions';

const form = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_WORKSPACE_PREFERENCES_DIALOG: return cleanDeep({ ...state, ...action.changes });
    default: return state;
  }
};

export default combineReducers({ form });
