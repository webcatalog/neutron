import { combineReducers } from 'redux';

import {
  UPDATE_EDIT_WORKSPACE_DOWNLOADING_ICON,
  UPDATE_EDIT_WORKSPACE_FORM,
} from '../../constants/actions';

const form = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_EDIT_WORKSPACE_FORM: return { ...state, ...action.changes };
    default: return state;
  }
};

const downloadingIcon = (state = false, action) => {
  switch (action.type) {
    case UPDATE_EDIT_WORKSPACE_DOWNLOADING_ICON: return action.downloadingIcon;
    default: return state;
  }
};

export default combineReducers({ downloadingIcon, form });
