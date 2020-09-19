import { combineReducers } from 'redux';

import {
  UPDATE_DIALOG_INTERNAL_URLS,
  OPEN_DIALOG_INTERNAL_URLS,
  CLOSE_DIALOG_INTERNAL_URLS,
} from '../../constants/actions';

const form = (state = {}, action) => {
  switch (action.type) {
    case OPEN_DIALOG_INTERNAL_URLS: return action.form;
    case UPDATE_DIALOG_INTERNAL_URLS: return { ...state, ...action.changes };
    default: return state;
  }
};

const open = (state = false, action) => {
  switch (action.type) {
    case OPEN_DIALOG_INTERNAL_URLS: return true;
    case CLOSE_DIALOG_INTERNAL_URLS: return false;
    default: return state;
  }
};

export default combineReducers({ open, form });
