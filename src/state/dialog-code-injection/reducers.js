/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { combineReducers } from 'redux';

import {
  UPDATE_CODE_INJECTION_FORM,
  OPEN_CODE_INJECTION_FORM,
  CLOSE_CODE_INJECTION_FORM,
} from '../../constants/actions';

const open = (state = false, action) => {
  switch (action.type) {
    case OPEN_CODE_INJECTION_FORM: return true;
    case CLOSE_CODE_INJECTION_FORM: return false;
    default: return state;
  }
};

const codeInjectionType = (state = null, action) => {
  switch (action.type) {
    case OPEN_CODE_INJECTION_FORM: return action.codeInjectionType;
    default: return state;
  }
};

const form = (state = {}, action) => {
  switch (action.type) {
    case OPEN_CODE_INJECTION_FORM: return action.form;
    case UPDATE_CODE_INJECTION_FORM: return { ...state, ...action.changes };
    default: return state;
  }
};

export default combineReducers({ open, codeInjectionType, form });
