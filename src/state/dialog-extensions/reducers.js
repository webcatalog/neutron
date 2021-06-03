/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { combineReducers } from 'redux';

import {
  OPEN_DIALOG_EXTENSIONS,
  CLOSE_DIALOG_EXTENSIONS,
} from '../../constants/actions';

const open = (state = false, action) => {
  switch (action.type) {
    case OPEN_DIALOG_EXTENSIONS: return true;
    case CLOSE_DIALOG_EXTENSIONS: return false;
    default: return state;
  }
};

export default combineReducers({ open });
