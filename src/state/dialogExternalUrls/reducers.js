/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { combineReducers } from 'redux';

import {
  UPDATE_DIALOG_EXTERNAL_URLS,
  OPEN_DIALOG_EXTERNAL_URLS,
  CLOSE_DIALOG_EXTERNAL_URLS,
} from '../../constants/actions';

const form = (state = {}, action) => {
  switch (action.type) {
    case OPEN_DIALOG_EXTERNAL_URLS: return action.form;
    case UPDATE_DIALOG_EXTERNAL_URLS: return { ...state, ...action.changes };
    default: return state;
  }
};

const open = (state = false, action) => {
  switch (action.type) {
    case OPEN_DIALOG_EXTERNAL_URLS: return true;
    case CLOSE_DIALOG_EXTERNAL_URLS: return false;
    default: return state;
  }
};

export default combineReducers({ open, form });
