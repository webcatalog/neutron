import { combineReducers } from 'redux';

import { UPDATE_CODE_INJECTION_FORM } from '../../constants/actions';

const form = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_CODE_INJECTION_FORM: return { ...state, ...action.changes };
    default: return state;
  }
};

export default combineReducers({ form });
