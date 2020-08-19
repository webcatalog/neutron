import { combineReducers } from 'redux';

import { UPDATE_CUSTOM_USER_AGENT_FORM } from '../../constants/actions';

const form = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_CUSTOM_USER_AGENT_FORM: return { ...state, ...action.changes };
    default: return state;
  }
};

export default combineReducers({ form });
