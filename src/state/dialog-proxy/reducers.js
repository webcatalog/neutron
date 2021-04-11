/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { combineReducers } from 'redux';

import {
  DIALOG_PROXY_FORM_UPDATE,
  DIALOG_PROXY_OPEN,
  DIALOG_PROXY_CLOSE,
} from '../../constants/actions';

const formInitialState = {
  proxyBypassRules: '',
  proxyPacScript: '',
  proxyAddress: '',
  proxyPort: '',
  proxyProtocol: 'socks5',
  proxyMode: 'direct',
};
const form = (state = formInitialState, action) => {
  switch (action.type) {
    case DIALOG_PROXY_OPEN: return action.form;
    case DIALOG_PROXY_FORM_UPDATE: {
      const { changes } = action;
      return { ...state, ...changes };
    }
    default: return state;
  }
};

const open = (state = false, action) => {
  switch (action.type) {
    case DIALOG_PROXY_OPEN: return true;
    case DIALOG_PROXY_CLOSE: return false;
    default: return state;
  }
};

export default combineReducers({
  open,
  form,
});
