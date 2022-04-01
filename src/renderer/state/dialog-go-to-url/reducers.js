/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { combineReducers } from 'redux';

import { UPDATE_GO_TO_URL_FORM } from '../../constants/actions';

const defaultForm = {
  url: '',
};

const form = (state = defaultForm, action) => {
  switch (action.type) {
    case UPDATE_GO_TO_URL_FORM: return { ...state, ...action.changes };
    default: return state;
  }
};

export default combineReducers({ form });
