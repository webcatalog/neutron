/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { combineReducers } from 'redux';

import {
  UPDATE_CUSTOM_USER_AGENT_FORM,
  OPEN_CUSTOM_USER_AGENT_FORM,
  CLOSE_CUSTOM_USER_AGENT_FORM,
} from '../../constants/actions';

const form = (state = {}, action) => {
  switch (action.type) {
    case OPEN_CUSTOM_USER_AGENT_FORM: return action.form;
    case UPDATE_CUSTOM_USER_AGENT_FORM: return { ...state, ...action.changes };
    default: return state;
  }
};

const open = (state = false, action) => {
  switch (action.type) {
    case OPEN_CUSTOM_USER_AGENT_FORM: return true;
    case CLOSE_CUSTOM_USER_AGENT_FORM: return false;
    default: return state;
  }
};

export default combineReducers({ open, form });
