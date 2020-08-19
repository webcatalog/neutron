import { combineReducers } from 'redux';

import {
  DIALOG_PROXY_FORM_UPDATE,
} from '../../constants/actions';

const formInitialState = {
  proxyBypassRules: '',
  proxyPacScript: '',
  proxyRules: '',
  proxyType: 'none',
};
const form = (state = formInitialState, action) => {
  switch (action.type) {
    case DIALOG_PROXY_FORM_UPDATE: {
      const { changes } = action;
      return { ...state, ...changes };
    }
    default: return state;
  }
};

export default combineReducers({
  form,
});
