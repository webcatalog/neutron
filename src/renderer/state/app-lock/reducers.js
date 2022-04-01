/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { combineReducers } from 'redux';

import {
  UPDATE_APP_LOCK_FORM,
} from '../../constants/actions';

const defaultForm = {
  password: '',
  passwordError: null,
};
const form = (state = defaultForm, action) => {
  switch (action.type) {
    case UPDATE_APP_LOCK_FORM: return { ...state, ...action.changes };
    default: return state;
  }
};

export default combineReducers({ form });
