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
