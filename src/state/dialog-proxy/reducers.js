import { combineReducers } from 'redux';

import {
  DIALOG_PROXY_FORM_UPDATE,
  DIALOG_PROXY_OPEN,
  DIALOG_PROXY_CLOSE,
} from '../../constants/actions';

const formInitialState = {
  proxyBypassRules: '',
  proxyPacScript: '',
  proxyRules: '',
  proxyType: 'none',
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
