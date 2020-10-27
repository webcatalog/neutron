import { combineReducers } from 'redux';

import {
  UPDATE_DIALOG_APP_LOCK,
  OPEN_DIALOG_APP_LOCK,
  CLOSE_DIALOG_APP_LOCK,
} from '../../constants/actions';

const form = (state = {}, action) => {
  switch (action.type) {
    case OPEN_DIALOG_APP_LOCK: return action.form;
    case UPDATE_DIALOG_APP_LOCK: return { ...state, ...action.changes };
    default: return state;
  }
};

const open = (state = false, action) => {
  switch (action.type) {
    case OPEN_DIALOG_APP_LOCK: return true;
    case CLOSE_DIALOG_APP_LOCK: return false;
    default: return state;
  }
};

export default combineReducers({ open, form });
